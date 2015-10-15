var HelloWorld = React.createClass({
    render() {
        return (<div>Hello World</div>);
    }
});
var child = (<div>Hello Planet<HelloWorld /></div>);

React.render(
    <App>{child}</App>,
    document.getElementById('content')
);