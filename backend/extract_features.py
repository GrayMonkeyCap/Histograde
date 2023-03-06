import histomicstk as htk
import numpy as np
import scipy as sp
import skimage.io
import skimage.measure
import skimage.color
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from PIL import Image
#Some nice default configuration for plots
plt.rcParams['figure.figsize'] = 15, 15
plt.rcParams['image.cmap'] = 'gray'
titlesize = 24
import histomicstk.segmentation.positive_pixel_count as ppc
import os
import cv2

def extract_features(file):
    

    image = Image.open(file.stream)
    
    # Convert the image to a NumPy array
    array = np.array(image)[:, :, :3]

    # Load reference image for normalization
    ref_image_file = ('./IMG_20230117_122922.jpg')  # L1.png

    im_reference = skimage.io.imread(ref_image_file)[:, :, :3]

    # get mean and stddev of reference image in lab space
    mean_ref, std_ref = htk.preprocessing.color_conversion.lab_mean_std(im_reference)

    # perform reinhard color normalization
    im_nmzd = htk.preprocessing.color_normalization.reinhard(array, mean_ref, std_ref)
    
    # create stain to color map
    stainColorMap = {
        'hematoxylin': [0.65, 0.70, 0.29],
        'eosin':       [0.07, 0.99, 0.11],
        'dab':         [0.27, 0.57, 0.78],
        'null':        [0.0, 0.0, 0.0]
    }

    # specify stains of input image
    stain_1 = 'hematoxylin'   # nuclei stain
    stain_2 = 'eosin'         # cytoplasm stain
    stain_3 = 'null'          # set to null of input contains only two stains

    # create stain matrix
    W = np.array([stainColorMap[stain_1],
                stainColorMap[stain_2],
                stainColorMap[stain_3]]).T

    # perform standard color deconvolution
    im_stains = htk.preprocessing.color_deconvolution.color_deconvolution(im_nmzd, W).Stains

    # get nuclei/hematoxylin channel
    im_nuclei_stain = im_stains[:, :, 0]

    # segment foreground
    foreground_threshold = 100

    im_fgnd_mask = sp.ndimage.morphology.binary_fill_holes(
        im_nuclei_stain < foreground_threshold)

    # run adaptive multi-scale LoG filter
    min_radius = 10
    max_radius = 15
    section_count=[0,0,0]
    lower_list=[]
    upper_list=[]
    middle_list=[]
    cell_ratio=[]
    im_log_max, im_sigma_max = htk.filters.shape.cdog(
        im_nuclei_stain, im_fgnd_mask,
        sigma_min=min_radius * np.sqrt(2),
        sigma_max=max_radius * np.sqrt(2)
    )

    # detect and segment nuclei using local maximum clustering
    local_max_search_radius = 10

    im_nuclei_seg_mask, seeds, maxima = htk.segmentation.nuclear.max_clustering(
        im_log_max, im_fgnd_mask, local_max_search_radius)

    # filter out small objects
    min_nucleus_area = 60

    im_nuclei_seg_mask = htk.segmentation.label.area_open(
        im_nuclei_seg_mask, min_nucleus_area).astype(np.int32)

    # compute nuclei properties
    objProps = skimage.measure.regionprops(im_nuclei_seg_mask,intensity_image=im_nuclei_stain)

    print ('Number of nuclei = ', len(objProps))

    nucleus_size=[]
    intensity=[]
    for nuclei in objProps:
        intensity.append(nuclei.mean_intensity)
        nucleus_size.append(nuclei.filled_area)
    print(nucleus_size)
    print(intensity)
    mean_int=np.mean(intensity)
    mean_size=np.mean(nucleus_size)
    print("Average Nucleus Size",mean_size)
    print("\n")
    print("Average Intensity",mean_int)
    print("\n")

    rects=[]
    for i in range(len(objProps)):
        if objProps[i].mean_intensity<=mean_int:
            c = [objProps[i].centroid[1], objProps[i].centroid[0], 0]
            width = objProps[i].bbox[3] - objProps[i].bbox[1] + 1
            height = objProps[i].bbox[2] - objProps[i].bbox[0] + 1
            
            
            if objProps[i].centroid[1]<(1024/3):
                section_count[0]+=1
            elif objProps[i].centroid[1]<(2*1024/3):
                section_count[1]+=1
            else:
                section_count[2]+=1

            cur_bbox = {
                "type":        "rectangle",
                "center":      c,
                "width":       width,
                "height":      height,
            }

            # plt.plot(c[0], c[1], 'g+')
            mrect = mpatches.Rectangle([c[0] - 0.5 * width, c[1] - 0.5 * height] ,
                                        width, height, fill=False, ec='g', linewidth=2)
            #computing cytoplasmic ratio
            
            ratio=(objProps[i].filled_area)/(height*width)
            cell_ratio.append(ratio)
            
            # plt.gca().add_patch(mrect)
            # label = 'Cr',str(ratio)[:4]
            # plt.gca().annotate(label, ([c[0] + 0.5 * width, c[1] + 0.5 * height] ), color='w', fontsize=10,weight='bold' )
            # rects.append(mrect)

    lower_list.append(section_count[0])
    middle_list.append(section_count[1])
    upper_list.append(section_count[2])
    print(section_count)
    print("Cytoplasmic Ratio")
    print(cell_ratio)


    return {
        'Mean Intensity':mean_int,
        'Mean Size':mean_size,
        'Cytoplasmic ratio':np.mean(cell_ratio),
        'Lower':section_count[0],
        'Mid':section_count[1],
        'Upper':section_count[2]
    }