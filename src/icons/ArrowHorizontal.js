import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/arrow_horizontal.svg';
import {styles} from "./defaults";

export default function ArrowHorizontal(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}