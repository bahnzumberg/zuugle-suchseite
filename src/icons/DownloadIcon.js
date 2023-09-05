import * as React from 'react';
import { ReactComponent as Icon } from './svg/actions/download.svg';
import {styles} from "./defaults";

export default function DownloadIcon(props){
    return <Icon style={{...props.style, width: "25px", height: "25px"}}/>
}
