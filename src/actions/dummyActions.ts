import flux from 'control';

class DummyActions implements AltJS.ActionsClass, IDummyAction {
    constructor(alt: AltJS.Alt) {
        //alt.generateActions('updateName');
    }

    updateName (name:string):void  {
        console.log(name + "2");
        this.dispatch(name);
    }

    dispatch(payload:any):void {
        console.log(payload);
    }
}

interface IDummyAction {
    updateName(name:string) : void;
}

var actions = flux.createActions<IDummyAction>(DummyActions);
//actions.updateName = (name: string) => console.log(name);

export default actions;