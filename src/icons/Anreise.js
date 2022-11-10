import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_anreise.svg';
import {styles} from "./defaults";

export default function Anreise(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}