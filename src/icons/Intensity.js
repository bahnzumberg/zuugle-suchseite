import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/intensity.svg';
import {styles} from "./defaults";

export default function Intensity(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}