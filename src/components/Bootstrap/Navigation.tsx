import './Navigation.less';
import * as React from 'react';
import {NavigationHeader} from './NavigationHeader';
import {NavigationBar} from 'NavigationBar/NavigationBar';
import {Container} from './Container';

export class Navigation extends React.Component<INavigationProps, any> {
    constructor(props:INavigationProps) {
        super(props);
    }

    public render() {
        var classes = 'Navigation' +
            ' navbar navbar-inverse navbar-fixed-top';
        return (
            <nav className={classes}>
                <Container fluid={this.props.fluid}>
                    <NavigationHeader applicationName={this.props.applicationName} />
                    <NavigationBar />
                </Container>
            </nav>
        );
    }
}

interface INavigationProps extends React.Props<Navigation> {
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
    applicationName: string;
    fluid?: boolean
}

export default Navigation;
