import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/arrow-before.svg';
import {styles} from "./defaults";

export default function ArrowBefore(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}