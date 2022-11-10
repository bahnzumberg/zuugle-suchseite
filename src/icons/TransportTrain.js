import * as React from 'react';
import { ReactComponent as YourSvg } from './../icons/svg/ic_transport_train.svg';
import {styles} from "./defaults";

export default function TransportTrain(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}