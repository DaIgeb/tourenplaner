import './NavigationHeader.less';
import * as React from 'react';
import {default as Button} from 'Button/Button';

export class NavigationHeader extends React.Component<INavigationHeaderProps, any> {
    constructor(props:INavigationHeaderProps) {
        super(props);
    }

    public render() {
        var classes = 'NavigationHeader' +
            ' navbar-header';
        var buttonAttributes:any = {
            "data-toggle": "collapse",
            "data-target": "#navbar",
            "aria-expanded": "false",
            "aria-controls": "navbar"
        };

        return (
            <div className={classes}>
                <Button className="navbar-toggle collapsed" attributes={buttonAttributes}>
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </Button>
                <a className="navbar-brand" href="#">{this.props.applicationName}</a>
            </div>
        );
    }
}

interface INavigationHeaderProps extends React.Props<NavigationHeader> {
    applicationName: string;
}

export default NavigationHeader;