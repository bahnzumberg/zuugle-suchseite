import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_chevron_right_bold.svg';
import {styles} from "./defaults";

export default function ChevronRight(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}