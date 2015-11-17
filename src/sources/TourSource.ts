import {actions} from "actions/RestaurantsActions";
import {ITourViewModel} from 'models/Tour'
import * as jquery from 'jquery';
import {reviveDates} from 'utils/moment'

class TourSourceModel implements AltJS.SourceModel<Array<ITourViewModel>> {
    local(state:any):any {
        console.warn("Local");
        console.warn(state);
        //TODO : Figure out why local doesn't work =(
        return [];
    }

    remote(state:any):Promise<Array<ITourViewModel>> {
        console.warn("Remote");
        this.hasFetched = true;
        return new Promise<Array<ITourViewModel>>((res, rej) => {
            jquery.ajax({
                url: '/api/tours',
                dataType: 'text'
            }).done((d:string) => {
                setTimeout(() => this.hasFetched = false, 30000);
                let parsed = <Array<ITourViewModel>>JSON.parse(d, reviveDates);
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

let TourSource:AltJS.Source = {
    fetchTours(): AltJS.SourceModel<Array<ITourViewModel>> {
        return new TourSourceModel();
    }
};

export const tourSource = TourSource;