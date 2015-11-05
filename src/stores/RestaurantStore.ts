import flux from 'control';
import {actions} from 'actions/RestaurantActions';
import {AbstractStoreModel} from './AbstractStoreModel'
import {restaurantSource} from 'sources/RestaurantSource';
import {IRestaurant} from 'models/Restaurant'
import IRestaurantActions from "../actions/RestaurantActions";

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
    fetchRestaurants() : void;
    isLoading(): boolean;
    getRestaurant(id:number) : Promise<IRestaurant>;
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

        this.exportPublicMethods({
            getRestaurant: this.getRestaurant
        });

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
        let maxIdItem = this.restaurants.slice(0).sort((r:IRestaurant, r2:IRestaurant) => r2.id - r.id)[0];
        name.id = maxIdItem.id + 1;
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

    getRestaurant(id:number):Promise<IRestaurant> {
        var p = new Promise<IRestaurant>((resolve:(restaurant:IRestaurant)=> void, reject: (reason?: any) => void) => {
            var tryResolve = function() {
                var state = this.getState();
                if (state.restaurants) {
                    var index = state.restaurants.findIndex((r:IRestaurant) => r.id === id);
                    if (index > -1) {
                        console.log("Resolving");
                        resolve(state.restaurants[index]);
                    }
                }
                else {
                    setTimeout(tryResolve, 100);
                }
            };

            tryResolve();
            console.log("Resolving");
            //reject("No Found");
        });


        return p;
    }

    private updateState = () => {
        this.setState({restaurants: this.restaurants, errorMessage: this.errorMessage});
    }
}

export const restaurantStore = <ExtendedStore>flux.createStore<IState>(RestaurantStore, "RestaurantStore");