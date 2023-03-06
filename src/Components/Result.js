import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Result=()=>{
    const location = useLocation()
    const {prediction,features,imageURL} = location.state
    console.log(imageURL);
    return <div className='body'><div class="card">
        
    <div class="left">
        <div class="head">Histo<span style={{color:'purple'}}>Grade</span></div>
        <div class="intro">Result : {prediction}</div>
        <div class="intro">Cytoplasmic Ratio : {JSON.stringify(features['Cytoplasmic ratio'])}</div>
        <div class="intro">Lower : {JSON.stringify(features['Lower'])}</div>
        <div class="intro">Mean Intensity : {JSON.stringify(features['Mean Intensity'])}</div>
        <div class="intro">Mean Size: {JSON.stringify(features['Mean Size'])}</div>
        <div class="intro">Mid : {JSON.stringify(features['Mid'])}</div>
        <div class="intro">Upper: {JSON.stringify(features['Upper'])}</div>
        <div class="intro">Upper: {JSON.stringify(features)}</div>

    </div>
    <div class="image">
        <img src={imageURL} alt=""/>
    </div>
</div>
</div>
}

export default Result