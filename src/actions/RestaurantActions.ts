import flux from 'control';
import {AbstractActions} from "./AbstractActions";
import {IRestaurant} from 'models/Restaurant'

class RestaurantActions extends AbstractActions implements IRestaurantActions {
    constructor(alt:AltJS.Alt) {
        super(alt);
    }

    add(name:IRestaurant):void {
        this.dispatch(name);
    }

    deleteRestaurant(name:IRestaurant):void {
        this.dispatch(name);
    }

    saveRestaurant(restaurant:IRestaurant):void {
        this.dispatch(restaurant);
    }

    updateRestaurants(restaurants:Array<IRestaurant>):void {
        this.dispatch(restaurants);
    }

    fetchRestaurants():void {
        this.dispatch();
    }

    restaurantsFailed(errorMessage:any):void {
        this.dispatch();
    }
}

interface IRestaurantActions {
    add(name:IRestaurant) : void;
    deleteRestaurant(name:IRestaurant) : void;
    saveRestaurant(restaurant:IRestaurant): void;
    updateRestaurants(restaurants:Array<IRestaurant>):void;
    fetchRestaurants():void;
    restaurantsFailed(errorMessage:any): void;
}

export const actions = flux.createActions<IRestaurantActions>(RestaurantActions);
export default actions;