import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_close_filled.svg';
import {styles} from "./defaults";

export default function CloseFilled(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}