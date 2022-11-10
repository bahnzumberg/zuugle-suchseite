import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_chevron_right_light.svg';
import {styles} from "./defaults";

export default function ChevronRightLight(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}