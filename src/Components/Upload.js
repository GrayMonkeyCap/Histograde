import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";

const ImageUploader = () => {
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

  const handleCropClick = () => {
    const canvas = editor.getImageScaledToCanvas().toDataURL();
  
      // Create a new FormData object
      const formData = new FormData();
  
      // Append the file to the FormData object
      formData.append('file', canvas);
  
      // Send the fetch request
      fetch('/predict', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        setFeatures(data.features);
      })
      .catch(error => console.error(error));
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
