import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_shuffle_black.svg';
import {styles} from "./defaults";

export default function ShuffleBlack(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}