import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_chevron_left_bold.svg';
import {styles} from "./defaults";

export default function ChevronLeft(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}