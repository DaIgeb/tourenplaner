import './Container.less';
import * as React from 'react';

export class Container extends React.Component<IContainerProps, any> {
    constructor(props:IContainerProps) {
        super(props);

    }

    public render() {
        var containerClass = this.props.fluid ? 'Container-fluid' : 'Container';
        containerClass += ' ' + containerClass.toLowerCase();
        return (
            <div className={containerClass}>{this.props.children}</div>
        );
    }
}

interface IContainerProps extends React.Props<Container> {
    fluid?: boolean;
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
}

export default Container;
