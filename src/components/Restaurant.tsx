import * as React from 'react';


class Restaurant extends React.Component<any, any> {
    constructor(props:any) {
        super(props);
    }

    render(): JSX.Element {
        if (this.props) {
            return (
                <div>{this.props.params.id}</div>
            )
        }

        return (<div>Foo</div>);
    }
}

export default Restaurant;