import React, { useState } from 'react'
import UploadModal from './Modal'

const Main=()=>{
    const [open,setIsOpen]=useState(false)
    const openModal=()=> {
        setIsOpen(true);
      }


    return <div className='body'><div class="card">
        <UploadModal open={open} setIsOpen={setIsOpen}/>
    <div class="left">
        <div class="head">Histo<span style={{color:'purple'}}>Grade</span></div>
        <div class="intro">Revolutionizing Oral Cancer Diagnosis: Accurate Grade Detection using Histopathological Images and AI Assistance for Pathologists</div>
        <button class="upload press" onClick={openModal}>Upload Image</button>
    </div>
    <div class="image">
        <img src="img.jpg" alt=""/>
    </div>
</div>
</div>
}

export default Main