import * as React from 'react';
import { ReactComponent as YourSvg } from './fly-swatter.svg';

export default function Swatter(props){
    return <YourSvg style={{ ...props.style}}/>
}