import * as React from 'react';
import { ReactComponent as Icon } from './svg/actions/pdf.svg';
import {styles} from "./defaults";

export default function PdfIcon(props){
    return <Icon style={{...styles, ...props.style}}/>
}
