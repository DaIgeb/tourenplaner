import {actions} from "actions/RestaurantsActions";
import {IRestaurant} from 'models/Restaurant'
import * as jquery from 'jquery';
import {reviveDates} from 'utils/moment'

class ResourceSourceModel implements AltJS.SourceModel<Array<IRestaurant>> {
    local(state:any):any {
        console.warn("Local");
        console.warn(state);
        //TODO : Figure out why local doesn't work =(
        return [];
    }

    remote(state:any):Promise<Array<IRestaurant>> {
        console.warn("Remote");
        this.hasFetched = true;
        return new Promise<Array<IRestaurant>>((res, rej) => {
            jquery.ajax({
                url: '/api/restaurants',
                dataType: 'text'
            }).done((d:string) => {
                setTimeout(() => this.hasFetched = false, 30000);
                let parsed = <Array<IRestaurant>>JSON.parse(d, reviveDates);
                res(parsed);
            }).fail(e => {
                rej(e)
            });
        });
    }

    success = actions.updateRestaurants;
    error = actions.restaurantsFailed;
    loading = actions.fetchRestaurants;
    shouldFetch = () => !this.hasFetched;

    private hasFetched: boolean= false;
}

let RestaurantSource:AltJS.Source = {
    fetchRestaurants(): AltJS.SourceModel<Array<IRestaurant>> {
        return new ResourceSourceModel();
    }
};

export const restaurantSource = RestaurantSource;