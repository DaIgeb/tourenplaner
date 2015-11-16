declare module ReactRouter {
    interface DefaultRouteProp {
        component: React.ComponentClass<any>;
    }

    interface RouteProp {
        component: React.ComponentClass<any>;
    }

    var IndexRoute:DefaultRouteClass;
}

declare module "webpack-dev-server" {
    let foo:any;
    export default foo;
}
declare module "webpack-dev-middleware" {
    let foo:any;
    export default foo;
}

declare module "webpack-hot-middleware" {

}

declare namespace __React {
    interface SyntheticInputEvent extends React.SyntheticEvent {
        target: InputEventTarget
    }

    interface InputEventTarget extends EventTarget {
        value:string;
    }
}