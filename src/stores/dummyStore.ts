import flux from '../control';
import * as Alt from 'alt';

import actions from 'actions/dummyActions';

interface StoreInterface {}

class DummyStore implements AltJS.StoreModel<StoreInterface> {
    name = 'awesome';

    bindAction = ( action:AltJS.Action<any>, handler:AltJS.ActionHandler)=> {

    };

    //@bind(actions.updateName)
    updateName(name: string) {
        this.name = name;
    }
}

var dummyStore = new DummyStore();

var store = flux.createStore(dummyStore, "awesome");
dummyStore.bindAction(flux.actions['updateName'], actions.updateName);

export default store;