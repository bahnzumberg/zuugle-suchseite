import React from "react";

function MountinImage({ imageUrl, style }) {
  return (
    <div>
      <img
        src={imageUrl}
        alt=""
        style={{ ...style, maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}

      />
    </div>
  );
}

export default MountinImage;
