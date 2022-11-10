import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/clock.svg';
import {styles} from "./defaults";

export default function Clock(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}