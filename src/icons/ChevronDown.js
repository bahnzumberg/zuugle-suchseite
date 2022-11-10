import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_chevron_down.svg';
import {styles} from "./defaults";

export default function ChevronDown(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}