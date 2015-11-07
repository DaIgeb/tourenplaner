/**
 *
 * Declarations for inheritance purposes
 *
 */
export class AbstractStoreModel<S> implements AltJS.StoreModel<S> {
    bindListeners:(obj:any)=> void;
    exportPublicMethods:(config:{[key:string]:(...args:Array<any>) => any}) => any;

    exportAsync(source:AltJS.Source):void {
    };

    exportConfig:any;

    getState():S {
        return null;
    };

    setState(state:S):void {
    };

    /*setState(stateFn:(currentState:S, nextState:S) => S):void {
    };

    bindAction(action:AltJS.Action<any>, handler:AltJS.ActionHandler):void {
    };*/

    bindActions(actions:any) {
    };

    waitFor(store:AltJS.AltStore<any>):void {
    };
}