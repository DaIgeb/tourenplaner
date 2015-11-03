import flux from 'control';
import {AbstractActions} from "./AbstractActions";
import {IRestaurant} from 'models/Restaurant'

class RestaurantActions extends AbstractActions {
    constructor(alt:AltJS.Alt) {
        super(alt);
        alt.generateActions("deleteRestaurant", "add", "saveRestaurant", "updateRestaurants", "fetchRestaurants", "restaurantsFailed");
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