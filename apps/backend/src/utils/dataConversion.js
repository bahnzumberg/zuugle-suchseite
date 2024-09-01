// convert the "difficulty" value into a text value of types

export const convertDifficulty = (difficulty) => {

  let convertedDifficulty = difficulty;
//   console.log("Difficulty / dataConversion.js: ",difficulty);

  switch (difficulty) {
    case 1:
      convertedDifficulty = "Leicht";
      break;
    case 2:
      convertedDifficulty = "Mittel";
      break;
    case 3:
      convertedDifficulty = "Schwer";
      break;

    default:
      convertedDifficulty = "Unbekannt";
      break;
  }
//   console.log("Difficulty / dataConversion.js: ",convertedDifficulty)

  return convertedDifficulty;
};