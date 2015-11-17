var HelloWorld = React.createClass({
    render: function () {
        return (React.createElement("div", null, "Hello World"));
    }
});
var child = (React.createElement("div", null, "Hello Planet", React.createElement(HelloWorld, null)));
React.render(React.createElement(App, {"applicationName": "foobar", "mainClasses": "row bg-danger"}, child), document.getElementById('content'));
//# sourceMappingURL=main.js.map