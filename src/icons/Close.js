import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_close.svg';
import {styles} from "./defaults";

export default function Close(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}