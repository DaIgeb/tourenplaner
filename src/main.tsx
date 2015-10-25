import * as React from 'react';

// Bootstrapping module
import * as Router from 'react-router';
import routes from 'routes';

Router.run(routes, Router.HistoryLocation, (Root: any, state: any) => {
    React.render(<Root {...state}/>, document.getElementById('content'));
});

React.render(
    <h1>Example</h1>,
    document.getElementById('content')
);
