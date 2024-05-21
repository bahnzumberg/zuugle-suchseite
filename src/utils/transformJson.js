// import { useTranslation } from "i18next";
import {formatToHHMM} from "../components/TimeLine/utils";

function getConnectionTypeString(CT) {
 
    const connectionTypes = {
        1: "details.zug",
        2: "details.bus",
        3: "details.strassenbahn",
        4: "details.u_bahn",
        5: "details.einschienenbahn",
        6: "details.zahnradbahn",
        7: "details.standseilbahn",
        8: "details.seilbahn",
        9: "details.faehre",
        10: "details.taxi",
        20: "details.verschiedenes"
    };
    return connectionTypes[CT];
}




export default async function transformToDescriptionDetail(descriptionJSON) {
    let descriptionDetail = "";

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

export function jsonToStringArray(connection, toFrom = "to", t){
    // consoleLog("L1 : connection : ",connection), get connection as an object
    // toFrom is "to" or "from" , to use the right text in end or begining of array
    // this is done by using either "totour_track_duration" or "fromtour_track_duration"

    let stringArray = [];
    if (connection?.connection_description_json && connection?.return_description_json) 
    {   let descriptionJSON = toFrom === "to" ? 
            connection.connection_description_json 
            : 
            connection.return_description_json;

        for (let i = 0; i < descriptionJSON.length; i++) {
            const connection = descriptionJSON[i];
            const connectionType = getConnectionTypeString(connection.CT);
            const translatedConnType = t(connectionType) // t("details.zug")


            if (connection.T === "D") {
                stringArray.push(`${connection.DT} ${connection.DS}`);
            } else if (connection.T === "C") {
                stringArray.push(` | ${t('details.std_mit_nach', { CD: connection.CD, connectionType: translatedConnType, CN: connection.CN })}`);
            } else if (connection.T === "T") {
                stringArray.push(`  =  ${t('details.std_umstiegszeit', { TD: connection.TD})}`);
            } else if (connection.T === "A") {
                stringArray.push(`${connection.AT} ${connection.AS}`);
            }
        }

        if(toFrom === "from"){
            stringArray.unshift(`  <  ${t('details.std_rueckstiegsdauer_vom_touren_endpunkt', {from_tour_track_duration: formatToHHMM(connection.fromtour_track_duration)})}`) 
        }else if(toFrom === "to"){
            stringArray.push(`  >  ${t('details.std_zustiegsdauer_zum_touren_ausgangspunkt', {totour_track_duration : formatToHHMM(connection.totour_track_duration) })}`) 
        }
    }

    return stringArray;
   
    
}
