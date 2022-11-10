import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_transport_bus.svg';
import {styles} from "./defaults";

export default function TransportBus(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}