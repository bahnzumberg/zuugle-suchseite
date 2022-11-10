import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_shuffle.svg';
import {styles} from "./defaults";

export default function Shuffle(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}