import * as React from 'react';
import { ReactComponent as YourSvg } from './svg/ic_car.svg';

export default function Car(props){
    return <YourSvg style={{ ...props.style}}/>
}