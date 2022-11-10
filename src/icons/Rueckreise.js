import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_rückreise.svg';
import {styles} from "./defaults";

export default function Rueckreise(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}