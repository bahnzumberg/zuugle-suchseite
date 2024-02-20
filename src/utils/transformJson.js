
function getConnectionTypeString(CT) {
    const connectionTypes = {
        1: "Zug",
        2: "Bus",
        3: "Straßenbahn",
        4: "U-Bahn",
        5: "Einschienenbahn",
        6: "Zahnradbahn",
        7: "Standseilbahn",
        8: "Seilbahn",
        9: "Fähre",
        10: "Taxi",
        20: "Verschiedenes"
    };
    return connectionTypes[CT];
}

// export default function transformToDescriptionDetail(descriptionJSON, toTourTrackDuration, fromTourTrackDuration) {
//     let descriptionDetail = "";

//     let totalTransferTime = 0;
//     let isReturn = false;

//     if(Array.isArray(descriptionJSON) && descriptionJSON.length > 0){
//         for (let i = 0; i < descriptionJSON.length; i++) {
//             const connection = descriptionJSON[i];
//             const connectionType = getConnectionTypeString(connection.CT);
//             const connectionName = connection.CN;
//             const duration = !!connection.CD ? connection.CD : "N/A"; // CD = Connection Duration
    
//             if (i === 0) {
//                 descriptionDetail += `${connection.DT} ${connection.DS}\n`;
//             } else if (connection.T === "C") {
//                 const transferInfo = connection.CI ? ` (${connection.CI})` : '';
//                 descriptionDetail += `  |  ${duration} Std mit ${connectionType} ${connectionName} nach${transferInfo}\n`;
//             } else if (connection.T === "T") {
//                 totalTransferTime += getMinutesFromDuration(duration);
//                 descriptionDetail += `  =  ${duration} Std Umstiegszeit\n`;
//             } else if (connection.T === "A") {
//                 if (!isReturn) {
//                     const remainingTransferTime = totalTransferTime;
//                     descriptionDetail += `  >  ${formatDuration(remainingTransferTime)} Std Zustiegsdauer zum Touren-Ausgangspunkt\n`;
//                     isReturn = true;
//                 } else {
//                     const remainingTransferTime = fromTourTrackDuration;
//                     descriptionDetail += `  <  ${formatDuration(remainingTransferTime)} Std Rückstiegsdauer vom Touren-Ausgangspunkt\n`;
//                 }
//             }
//         }
//     }

//     return descriptionDetail;
// }

export default function transformToDescriptionDetail(descriptionJSON) {
    let descriptionDetail = "";

    // let totalTransferTime = 0;

    for (let i = 0; i < descriptionJSON.length; i++) {
        const connection = descriptionJSON[i];
        const connectionType = getConnectionTypeString(connection.CT);

        if (connection.T === "D") {
            descriptionDetail += `${connection.DT} ${connection.DS}\n`;
        } else if (connection.T === "C") {
            descriptionDetail += `  |  ${connection.CD} Std mit ${connectionType} ${connection.CN} nach\n`;
        } else if (connection.T === "T") {
            // totalTransferTime += getMinutesFromDuration(duration);
            descriptionDetail += `  =  ${connection.TD} Std Umstiegszeit\n`;
        } else if (connection.T === "A") {
            descriptionDetail += `${connection.AT} ${connection.AS}\n`;
        }
    }

    return descriptionDetail;
}


//    if(Array.isArray(descriptionJSON) && descriptionJSON.length > 0){
