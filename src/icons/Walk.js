import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/walk.svg';
import {styles} from "./defaults";

export default function Walk(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}