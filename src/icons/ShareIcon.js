import * as React from 'react';
import { ReactComponent as Icon } from './svg/actions/share.svg';

export default function ShareIcon(props){
    return <Icon style={{...props.style, width: "25px", height: "25px"}}/>
}
