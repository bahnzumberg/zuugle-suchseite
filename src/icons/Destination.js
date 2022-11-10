import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_destination.svg';
import {styles} from "./defaults";

export default function Destination(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}