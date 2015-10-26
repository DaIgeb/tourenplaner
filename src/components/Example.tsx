import * as React from 'react';
import flux from 'control';
import DummyStore from 'stores/dummyStore';
import DummyActions from 'actions/dummyActions';
import EventHandler = __React.EventHandler;

class Example extends React.Component<IExampleProps, IExampleState> {
    constructor(props: IExampleProps) {
        super(props);
        this.state = {
            name: 'Daniel' //props.name
        }
    }

    static getStores(props: IExampleProps) {
        return [DummyStore];
    }

    static getPropsFromStores(props: IExampleProps) {
        return DummyStore.getState();
    }

    render() {
        return (
            <div>
                <input type="text" value={this.state.name} onChange={this.onChange}/>
                <h1>It works: {this.props.name}</h1>
            </div>
        );
    }

    onChange = (evt: any)=> {
        this.setState({name: evt.target.value});
        DummyActions.updateName(evt.target.value);
    }
}

export interface IExampleProps extends React.Props<Example>{
    name: string;
}

export interface IExampleState {
    name: string;
}

export default Example;