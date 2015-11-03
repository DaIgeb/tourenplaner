import * as React from 'react';
import {Link} from 'react-router';

class Main extends React.Component<any, any> {
    constructor(props: any){
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Example</h1>
                <Link to='/example'>Go to the Example page...</Link>
                <Link to='/example2'>Go to the Example page 2...</Link>
                {this.props.children}
            </div>
        );
    }
}

export default Main;