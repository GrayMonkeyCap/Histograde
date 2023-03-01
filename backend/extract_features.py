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

    cv2.imshow(im_nmzd)