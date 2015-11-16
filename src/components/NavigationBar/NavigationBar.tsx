import './NavigationBar.less';
import * as React from 'react';
import {Link} from 'react-router';

export class NavigationBar extends React.Component<INavigationBarProps, any> {
    constructor(props:INavigationBarProps) {
        super(props);
    }

    public render() {
        var classes = 'NavigationBar' +
            ' collapse navbar-collapse';

        /*var isActive = this.context.router.isActive("about", undefined, undefined);
        var aboutClassName = isActive ? "active": "";
        isActive = this.context.router.isActive("restaurants", undefined, undefined);
        var restClassName = isActive ? "active": "";*/

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
                        <Link to='about'>About</Link>
                    </li>
                    <li>
                        <Link to='/restaurants'>Restaurant</Link>
                    </li>
                    <li>
                        <Link to='/tours'>Touren</Link>
                    </li>
                </ul>
            </div>
        );
    }

    context: {router: ReactRouter.State}
}
/*
NavigationBar.contextTypes = {
    router: React.PropTypes.object.isRequired
};
*/
interface INavigationBarProps extends React.Props<NavigationBar> {
}

export default NavigationBar;