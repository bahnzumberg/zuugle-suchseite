import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/arrow_vertical.svg';
import {styles} from "./defaults";

export default function ArrowVertical(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}