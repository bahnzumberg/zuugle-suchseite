import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/arrow-left.svg';
import {styles} from "./defaults";

export default function ArrowLeft(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}