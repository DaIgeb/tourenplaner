import flux from 'control';
import actions from 'actions/dummyActions';

interface StoreInterface {
}

class DummyStore implements AltJS.StoreModel<StoreInterface> {
    constructor() {
        this.name = 'awesome';

        (<any>this).bindListeners({
            updateName: actions.updateName
        })
    }

    updateName(name:string) {
        console.log('Store');
        this.name = name;
        (<any>this).setState({name: name});
        (<any>this).emitChange();
    }

    private state = {name: 'Daniel222'};
    private name:string;
}

var store = flux.createStore(DummyStore, "DummyStore");

export default store;