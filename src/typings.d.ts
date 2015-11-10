declare module ReactRouter {
    interface DefaultRouteProp {
        component: React.ComponentClass<any>;
    }

    interface RouteProp {
        component: React.ComponentClass<any>;
    }

    var IndexRoute: DefaultRouteClass;
}

declare module "webpack-dev-server" {
    let foo: any;
    export default foo;
}
declare module "webpack-dev-middleware" {
    let foo: any;
    export default foo;
}