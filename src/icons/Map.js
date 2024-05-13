import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/map.svg';

export default function Map(props){
    return <YourSvg style={{ ...props.style}}/>
}

