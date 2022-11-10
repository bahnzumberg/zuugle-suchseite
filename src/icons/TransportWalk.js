import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_transport_walk.svg';
import {styles} from "./defaults";

export default function TransportWalk(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}