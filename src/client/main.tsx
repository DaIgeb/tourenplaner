import React = require('react');
import rDom = require('react-dom');
import App = require('App');

var HelloWorld = React.createClass({
    render() {
        return (<div>Hello World</div>);
    }
});
var child = (<div>Hello Planet<HelloWorld /></div>);

rDom.render(
    <App>{child}</App>,
    document.getElementById('content')
);