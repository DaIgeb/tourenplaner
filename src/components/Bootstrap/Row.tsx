import * as React from 'react';

interface IState {
}

interface IRowProps extends React.Props<Row> {

}

export class Row extends React.Component<IRowProps, IState> {
    constructor(props:any) {
        super(props);
    }

    render():JSX.Element {
        return (<div className="row">{this.props.children}</div>);
    }
}