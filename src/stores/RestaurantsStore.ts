import {flux} from 'control';
import {actions} from 'actions/RestaurantsActions';
import {AbstractStoreModel} from './AbstractStoreModel'
import {restaurantSource} from 'sources/RestaurantSource';
import {IRestaurant} from 'models/Restaurant';

interface IState {
    selectedRestaurant: IRestaurant;
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
    private selectedId:number;

    getRestaurants():Array<IRestaurant> {
        return this.restaurants;
    }

    getRestaurant(id:number):IRestaurant {
        let restaurant:IRestaurant;
        if (id === -1) {
            restaurant = {
                id: id,
                name: "asd",
                address: "",
                zipCode: "",
                city: "",
                location: {lat: null, long: null},
                data: [
                    {
                        id: -1,
                        businessHours: [{
                            weekday: "",
                            from: {
                                hour: null,
                                minute: null
                            },
                            until: {
                                hour: null,
                                minute: null
                            },
                        }
                        ],
                        phone: "",
                        notes: "",
                        from: null,
                        until: null
                    }
                ]
            }
            ;
        }
        else {
            if (this.restaurants)
                restaurant = this.restaurants.find((r:IRestaurant) => r.id === id);
        }

        return restaurant;
    }

    selectedRestaurant:IRestaurant;
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
            handleFailed: actions.restaurantsFailed,
            onSelect: actions.restaurantSelected
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
        if (this.selectedId) {
            this.selectedRestaurant = this.getRestaurant(this.selectedId);
        }
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

    onSelect(id:number) {
        this.selectedId = id;
        this.selectedRestaurant = this.getRestaurant(id);
    }

    private updateState = () => {
        this.setState({
            restaurants: this.restaurants,
            errorMessage: this.errorMessage,
            selectedRestaurant: this.selectedRestaurant
        });
    }
}

export const restaurantsStore = <ExtendedStore>flux.createStore<IState>(RestaurantsStore, "RestaurantsStore");