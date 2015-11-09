import * as React from 'react';

interface IPanelProps extends React.Props<Panel> {
    title: string | React.ReactNode;
    initialIsCollapsed?: boolean;
}

interface IPanelState {
    isCollapsed: boolean;
}

export class Panel extends React.Component<IPanelProps, IPanelState> {
    constructor(props:any) {
        super(props);

        this.state = {
            isCollapsed: this.props.initialIsCollapsed
        };
    }

    render():JSX.Element {
        let classNames = 'panel-body' + (this.state.isCollapsed ? ' collapse' : '');
        return (
            <div className="panel panel-default">
                <div className="panel-heading" onClick={this.toggleCollapse}>{this.props.title}</div>
                <div className={classNames}>
                    {this.props.children}
                </div>
            </div>
        );
    };

    private toggleCollapse = ():void => {
        this.setState({isCollapsed: !this.state.isCollapsed});
    }
}
