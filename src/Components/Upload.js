import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useNavigate } from "react-router-dom";

const ImageUploader = () => {
  const navigate = useNavigate()
  const [image, setImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleScaleChange = (e) => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const handlePositionChange = (position) => {
    setPosition(position);
  };
  function srcToFile(src, fileName, mimeType){
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    )
}
  const handleCropClick = () => {
    const canvas = editor.getImageScaledToCanvas().toDataURL();
      console.log(canvas);
      srcToFile(
        canvas,
        'hello',
        canvas.slice(canvas.indexOf(":")+1,canvas.indexOf(";"))
      )
      .then(function(file){
          console.log(file);
          var fd = new FormData();
          fd.append("file", file);
          return fetch('/predict', {method:'POST', body:fd});
      })
      .then(function(res){
          return res.json();
      })
      .then((data)=>{
        console.log(data)
        navigate('/result',
        {state:{
          'prediction':data.prediction,
          'features':data.features,
          'imageURL':canvas
        }})
      })
      .catch(console.error)
      ;
  };

  return (
    <div>
      <input className="choose" type="file" onChange={handleImageChange} />
      {image && (
        <AvatarEditor
          ref={(ref) => setEditor(ref)}
          image={image}
          width={250}
          height={250}
          border={50}
          borderRadius={0}
          scale={scale}
          position={position}
          onPositionChange={handlePositionChange}
          style={{ marginTop: "20px" }}
        />
      )}
      <div style={{ marginTop: "20px" }}>
        <input
          type="range"
          min="1"
          max="4"
          step="0.01"
          value={scale}
          onChange={handleScaleChange}
        />
      </div>
      <div style={{ marginTop: "20px" }}>
        <button class='modalButton' onClick={handleCropClick}>Crop Image</button>
      </div>
    </div>
  );
};

export default ImageUploader;
