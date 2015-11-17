import {flux} from 'shared/control';
import {AbstractActions} from "./AbstractActions";
import {IRestaurant} from 'models/Restaurant'

class RestaurantsActions extends AbstractActions implements IRestaurantsActions {
    constructor(alt:AltJS.Alt) {
        super(alt);
    }

    add(restaurant:IRestaurant):void {
        this.dispatch(restaurant);
    }

    deleteRestaurant(restaurant:IRestaurant):void {
        this.dispatch(restaurant);
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
        this.dispatch(errorMessage);
    }
}

interface IRestaurantsActions {
    add(name:IRestaurant) : void;
    deleteRestaurant(name:IRestaurant) : void;
    saveRestaurant(restaurant:IRestaurant): void;
    updateRestaurants(restaurants:Array<IRestaurant>):void;
    fetchRestaurants():void;
    restaurantsFailed(errorMessage:any): void;
}

export const actions = flux.createActions<IRestaurantsActions>(RestaurantsActions);