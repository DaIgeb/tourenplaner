import './NavigationBar.less';
import * as React from 'react';
import {default as Button} from 'Button/Button';

export class NavigationBar extends React.Component<INavigationBarProps, any> {
    constructor(props:INavigationBarProps) {
        super(props);
    }

    public render() {
        var classes = 'NavigationBar' +
            ' collapse navbar-collapse';

        return (
            <div id="navbar" className={classes}>
                <ul className="nav navbar-nav navbar-right">
                    <li className="active dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                           aria-haspopup="true"
                           aria-expanded="false">Saison (2016 - Version 2)
                            <span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <a href="#">Another action</a>
                            </li>
                            <li>
                                <a href="#">Something else here</a>
                            </li>
                            <li role="separator" className="divider"></li>
                            <li>
                                <a href="#">Separated link</a>
                            </li>
                            <li role="separator" className="divider"></li>
                            <li>
                                <a href="#">One more separated link</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#about">About</a>
                    </li>
                    <li>
                        <a href="#contact">Contact</a>
                    </li>
                </ul>
            </div>
        );
    }
}

interface INavigationBarProps extends React.Props<NavigationBar> {
}

export default NavigationBar;