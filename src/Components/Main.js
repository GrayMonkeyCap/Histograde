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
        <div class="head">Histopathology</div>
        <div class="intro">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus aperiam voluptas ipsa maiores quasi dicta, excepturi dolorem placeat est, quisquam officia totam labore ab nam illo saepe? Mollitia, pariatur voluptas!</div>
        <button class="upload press" onClick={openModal}>Upload Image</button>
    </div>
    <div class="image">
        <img src="img.jpg" alt=""/>
    </div>
</div>
</div>
}

export default Main