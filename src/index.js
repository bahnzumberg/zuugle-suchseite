import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from "./rootReducer";
import { Helmet } from 'react-helmet';
import {createBrowserHistory} from 'history';
import { Provider } from 'react-redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));



export const history = createBrowserHistory();

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style');
    msViewportStyle.appendChild(
        document.createTextNode(
            '@-ms-viewport{width:auto!important}'
        )
    );
    document.head.appendChild(msViewportStyle);
}

let host = window.location.protocol + "//" +window.location.hostname;

ReactDOM.render((
    <Provider store={store}>
        <div>
            <Helmet>
                <link rel="canonical" href="https://www.zuugle.at"/>
                <link id="favicon" rel="icon" href="/app_static/favicon.png" type="image/x-icon"/>
            </Helmet>
        </div>
        <App />
    </Provider>
), document.getElementById('root'));