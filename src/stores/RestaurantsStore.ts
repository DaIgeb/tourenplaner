import {flux} from 'control';
import {actions} from 'actions/RestaurantsActions';
import {AbstractStoreModel} from './AbstractStoreModel'
import {restaurantSource} from 'sources/RestaurantSource';
import {IRestaurant} from 'models/Restaurant';
import * as jquery from 'jquery';

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
    getRestaurants(): Array<IRestaurant>;
    getRestaurant(id:number) : IRestaurant;
}

class RestaurantsStore extends AbstractStoreModel<IState> implements IState {
    getRestaurants():Array<IRestaurant> {
        return this.restaurants;
    }

    getRestaurant(id:number):IRestaurant {
        if (!isNaN(id)) {
            if (this.restaurants) {
                return this.restaurants.find((r:IRestaurant) => r.id === id);
            }
        }

        return null;
    }

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
            getRestaurants: this.getRestaurants,
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
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/restaurants', false);

        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        /*xhr.onload = (ev:Event)=> {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.response);
                restaurantsStore.fetchRestaurants();
            } else {
                const responseText = ( <any>ev.target).responseText;
                console.log('Error !' + responseText);
                this.errorMessage = responseText;
            }
        };*/

        xhr.send(JSON.stringify(name));

        name.id = xhr.response;
        this.restaurants.push(name);

        this.updateState();
    }

    handleDelete(name:IRestaurant):void {
        var indexOf = this.restaurants.indexOf(name);
        if (indexOf >= 0) {
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/api/restaurants/${name.id}`, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.onload = (ev:Event)=> {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log(xhr.response);
                    restaurantsStore.fetchRestaurants();
                } else {
                    const responseText = ( <any>ev.target).responseText;
                    console.log('Error !' + responseText);
                    this.errorMessage = responseText;
                }
            };
            xhr.send();

            this.restaurants.splice(indexOf, 1);
            this.updateState();
        }
    }

    handleSave(name:IRestaurant):void {
        this.restaurants.push(name);

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `/api/restaurants/${name.id}`, true);

        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = (ev:Event)=> {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.response);
                restaurantsStore.fetchRestaurants();
            } else {
                const responseText = ( <any>ev.target).responseText;
                console.log('Error !' + responseText);
                this.errorMessage = responseText;
            }
        };

        xhr.send(JSON.stringify(name));

        this.updateState();
    }

    private updateState = () => {
        this.setState({
            restaurants: this.restaurants,
            errorMessage: this.errorMessage
        });
    }
}

export const restaurantsStore = <ExtendedStore>flux.createStore<IState>(RestaurantsStore, "RestaurantsStore");