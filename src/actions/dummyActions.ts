import flux from 'control';
import * as Alt from 'alt';

class DummyActions implements AltJS.ActionsClass {
    constructor(alt: AltJS.Alt) {
        alt.generateActions('updateName');
    }

    dispatch(payload:any):void {
    }
}

interface IDummyAction {
    updateName(name:string) : void;
}

var actions = flux.createActions<IDummyAction>(DummyActions, null);

export default actions;