'use strict';

import './seasons.less';
import * as React from 'react';
import * as rDom from 'react-dom';
import {App} from 'App/App';

var appState = {
    applicationName: "Tourenplaner",
    fluid: true,
    currentTabId: "Foobar"
};

console.log("Error");

rDom.render(
    (<App state={appState}/>),
    document.getElementById('content')
);