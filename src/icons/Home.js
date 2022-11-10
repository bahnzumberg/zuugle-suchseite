import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_home.svg';
import {styles} from "./defaults";

export default function Home(props){
    return <YourSvg style={{...styles, ...props.style}}/>
}