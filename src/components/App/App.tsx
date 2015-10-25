'use strict';

import './App.less';
import * as React from 'react';
import {default as Navigation} from 'Navigation/Navigation';
import {default as Container} from 'Container/Container';

export class App extends React.Component<IAppProps, IAppState> {
    constructor(props:IAppProps) {
        super(props);

        this.state = props.state;
    }

    public render() {
        var navContainer = (<Navigation applicationName={this.state.applicationName} fluid={this.state.fluid}/>);
        var content = (<Container fluid={this.state.fluid}>
            Hello World!
        </Container>);

        return (
            <div className="App">
                {navContainer}
                {content}</div>
        );
    }
}

export interface IAppProps extends React.Props<App> {
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
    state: IAppState;
}

export interface IAppState {
    currentTabId: string;
    applicationName: string;
    fluid: boolean
}

export default App;
