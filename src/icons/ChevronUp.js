import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_chevron_up.svg';
import {styles} from "./defaults";

export default function ChevronUp(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}