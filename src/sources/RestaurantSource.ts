import {actions} from "actions/RestaurantActions";
import {IRestaurant} from 'models/Restaurant'

const rest1:IRestaurant = {
    key: 1,
    location: "Hagenbuch",
    name: "Hirschen",
    phone: "052 722 12 34",
    notes: "Dienstags Ruhetag"
};

const rest2:IRestaurant = {
    key: 2,
    location: "Warth",
    name: "Hirschen",
    phone: "052 722 12 34",
    notes: "Dienstags Ruhetag"
};
const rest3:IRestaurant = {
    key: 3,
    location: "Ossingen",
    name: "Hirschen",
    phone: "052 722 12 34",
    notes: "Dienstags Ruhetag"
};

const mockData:IRestaurant[] = [rest1, rest2, rest3];

let RestaurantSource:AltJS.Source = {
    fetchRestaurants(): AltJS.SourceModel<IRestaurant[]> {
        return {
            remote() {
                console.warn("Remote");
                return new Promise<Array<IRestaurant>>((res, rej) => {
                    setTimeout(() => {
                        if (true) {
                            res(mockData);
                        } else {
                            rej("Things have broken");
                        }
                    }, 250)
                })
            },
            local(state): IRestaurant[] {
                console.warn("Local");
                console.warn(state);
                //TODO : Figure out why local doesn't work =(
                return mockData;
            },
            success: actions.updateRestaurants,
            error: actions.restaurantsFailed,
            loading: actions.fetchRestaurants,
            shouldFetch: () => true
        };
    }
};

export const restaurantSource = RestaurantSource;