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
