import * as React from 'react';

interface IState {
}

interface IColumnProps extends React.Props<Column> {
    size: number;
    classNames?: string;
}

export class Column extends React.Component<IColumnProps, IState> {
    constructor(props:any) {
        super(props);
    }

    render():JSX.Element {
        let className = `col-md-${this.props.size} ${this.props.classNames}`;
        return (<div className={className}>{this.props.children}</div>);
    }
}