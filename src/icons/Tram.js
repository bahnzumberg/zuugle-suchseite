import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_tram.svg';
import {styles} from "./defaults";

export default function Tram(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}