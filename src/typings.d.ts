declare module ReactRouter {
    interface DefaultRouteProp {
        component: React.ComponentClass<any>;
    }

    interface RouteProp {
        component: React.ComponentClass<any>;
    }

    var IndexRoute: DefaultRouteClass;
}