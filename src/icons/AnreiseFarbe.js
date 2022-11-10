import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_anreise_farbe.svg';
import {styles} from "./defaults";

export default function AnreiseFarbe(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}