import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_überschreitung.svg';
import {styles} from "./defaults";

export default function Überschreitung(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}