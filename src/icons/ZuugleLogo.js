import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/zuugle_logo.svg';
import {styles} from "./defaults";

export default function ZuugleLogo(props){
    return <YourSvg style={{...styles, stroke: "#4992FF", fill: "#4992FF", width: undefined, height: undefined, ...props.style}}/>
}