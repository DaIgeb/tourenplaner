import flux from 'control';
import {actions} from 'actions/RestaurantActions';
import {AbstractStoreModel} from './AbstractStoreModel'
import {restaurantSource} from 'sources/RestaurantSource';
import {IRestaurant} from 'models/Restaurant'

interface IState {
    restaurants: Array<IRestaurant>;
    errorMessage:string;
}

/**
 * Extending the state store in order to include aditional methods from
 * export Public methods and
 * export Async
 */
interface ExtendedStore extends AltJS.AltStore<IState> {
    fetchRestaurants() :void;
    isLoading(): boolean;
}

class RestaurantStore extends AbstractStoreModel<IState> implements IState {
    restaurants:Array<IRestaurant>;
    errorMessage:string;

    constructor() {
        super();
        this.restaurants = [];
        this.errorMessage = null;

        this.bindListeners({
            handleAdd: actions.add,
            handleDelete: actions.deleteRestaurant,
            handleSave: actions.saveRestaurant,
            handleUpdate: actions.updateRestaurants,
            handleFetch: actions.fetchRestaurants,
            handleFailed: actions.restaurantsFailed
        });
        /*
         this.exportPublicMethods({
         getLocation: this.getLocation
         });*/

        this.exportAsync(restaurantSource);
    }

    handleUpdate(restaurants:Array<IRestaurant>) {
        this.restaurants = restaurants;
        this.errorMessage = null;
        this.updateState();
    }

    handleFetch() {
        this.restaurants = [];
        this.updateState();
    }

    handleFailed(errorMessage:string) {
        this.errorMessage = errorMessage;
        this.updateState();
    }

    handleAdd(name:IRestaurant):void {
        this.restaurants.push(name);
        this.updateState();
    }

    handleDelete(name:IRestaurant):void {
        var indexOf = this.restaurants.indexOf(name);
        if (indexOf >= 0) {
            this.restaurants.splice(indexOf, 1);
            this.updateState();
        }
    }

    handleSave(name:IRestaurant):void {
        this.restaurants.push(name);
        this.updateState();
    }

    private updateState = () => {
        this.setState({restaurants: this.restaurants, errorMessage: this.errorMessage});
    }
}

export const restaurantStore = <ExtendedStore>flux.createStore<IState>(RestaurantStore, "RestaurantStore");