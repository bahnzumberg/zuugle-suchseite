import React from "react";

function MountinImage({ imageUrl }) {
  return (
    <div>
      <img
        src={imageUrl}
        alt=""
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

export default MountinImage;
