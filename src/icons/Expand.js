import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_expand.svg';
import {styles} from "./defaults";

export default function Expand(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}