import {actions} from "actions/RestaurantsActions";
import {IRestaurant} from 'models/Restaurant'
import * as jquery from 'jquery';
import {reviveDates} from '../utils'

let shouldFetch = true;
let RestaurantSource:AltJS.Source = {
    fetchRestaurants(): AltJS.SourceModel<Array<IRestaurant>> {
        return {
            remote() {
                console.warn("Remote");
                shouldFetch = false;
                return new Promise<Array<IRestaurant>>((res, rej) => {

                    jquery.ajax({
                        url: '/api/restaurants',
                        dataType: 'text'
                    }).done((d:string) =>
                    {
                        let parsed = <Array<IRestaurant>>JSON.parse(d, reviveDates);
                        res(parsed);
                    }).fail(e =>
                    {
                        rej(e)
                    });
                })
            },
            local(state): IRestaurant[] {
                console.warn("Local");
                console.warn(state);
                //TODO : Figure out why local doesn't work =(
                return [];
            },
            success: actions.updateRestaurants,
            error: actions.restaurantsFailed,
            loading: actions.fetchRestaurants,
            shouldFetch: () => shouldFetch
        };
    }
};

export const restaurantSource = RestaurantSource;