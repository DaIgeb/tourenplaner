import flux from 'control';

class DummyActions implements AltJS.ActionsClass {
    constructor(alt: AltJS.Alt) {
        //alt.generateActions('updateName');
    }

    dispatch(payload:any):void {
        console.log(payload);
    }
}

interface IDummyAction {
    updateName(name:string) : void;
}

var actions = flux.createActions<IDummyAction>(DummyActions, flux);

export default actions;