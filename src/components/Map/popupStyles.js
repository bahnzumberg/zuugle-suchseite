// const popupContent = {
//   textAlign: "center",
//   height: "auto",
//   // width: "300px",
//   width: "100%",
//   marginTop: "15px",
//   cursor: "pointer",
//   fontFamily: "Helvetica Neue, Arial, Helvetica, sans-serif",
//   fontSize: "0.75rem",
//   lineHeight: "1.5",
//   color: "#333",
//   boxShadow: "0 3px 14px rgba(0,0,0,0.4)",
//   borderRadius: "5px",
//   border: "1px solid rgba(89, 255, 0, 0.233)",
//   padding: "1px",
//   background: "white",
//   boxSizing: "border-box",
//   maxWidth: "300px",
// };

// const popupHead = {
//   fontWeight: "bold",
//   fontSize: "15px",
//   marginBottom: "10px",
// };

// const popupText = {
//   fontSize: "15px",
//   marginBottom: "20px",
// };

// // const popupImage = {
// //   width: "100%",
// //   height: "auto",
// //   objectFit: "cover",
// //   borderRadius: "5px",
// // };
// const popupImage = {
//   width: "100%",
//   height: "auto",
//   objectFit: "fill",
//   borderRadius: "5px",
// };

// export { popupContent, popupHead, popupText, popupImage };



// import styled from 'styled-components';

// const PopupContent = styled.div`
//   text-align: center;
//   height: 250px;
//   margin-top: 15px;
//   cursor: pointer;
//   font-family: "Helvetica Neue, Arial, Helvetica, sans-serif";
//   font-size: 0.75rem;
//   line-height: 1.5;
//   color: #333;
//   box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
//   border-radius: 5px;
//   border: 1px solid rgba(89, 255, 0, 0.233);
//   padding: 1px;
//   background: white;
//   box-sizing: border-box;
//   max-width: 300px; /* Maximum width for larger screens */

//   @media (max-width: 900px) {
//     max-width: 70%; /* Maximum width of 70% of the viewport width */
//   }

//   @media (max-width: 600px) {
//     max-width: 50%; /* Maximum width of 50% of the viewport width */
//   }
// `;

// const PopupHead = styled.div`
//   font-weight: bold;
//   font-size: 15px;
//   margin-bottom: 10px;
// `;

// const PopupText = styled.div`
//   font-size: 15px;
//   margin-bottom: 20px;
// `;

// const PopupImage = styled.img`
//   width: 100%; /* Ensures the image takes the full width of its container */
//   height: auto; /* Maintain aspect ratio */
//   object-fit: cover; /* Ensure the image covers the container while maintaining its aspect ratio */
//   border-radius: 5px; /* Adds rounded corners to the image */
// `;

// export { PopupContent, PopupHead, PopupText, PopupImage };

import styled from 'styled-components';

const PopupContent = styled.div`
  text-align: center;
  height: auto;
  margin-top: 15px;
  cursor: pointer;
  font-family: "Helvetica Neue, Arial, Helvetica, sans-serif";
  font-size: 0.75rem;
  line-height: 1.5;
  color: #333;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  border: 1px solid rgba(89, 255, 0, 0.233);
  padding: 1px;
  background: white;
  box-sizing: border-box;
  max-width: 300px; /* Maximum width for larger screens */

  @media (max-width: 900px) {
    max-width: 70vw; /* Maximum width of 70% of the viewport width */
  }

  @media (max-width: 600px) {
    max-width: 30vw; /* Maximum width of 50% of the viewport width */
  }
`;

const PopupHead = styled.div`
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 10px;
`;

const PopupText = styled.div`
  font-size: 15px;
  margin-bottom: 20px;
`;

const PopupImage = styled.img`
  width: 100%; /* Ensures the image takes the full width of its container */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover; /* Ensure the image covers the container while maintaining its aspect ratio */
  border-radius: 5px; /* Adds rounded corners to the image */

`;

export { PopupContent, PopupHead, PopupText, PopupImage };
