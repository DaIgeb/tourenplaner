import {flux} from 'shared/control';
import {actions} from 'actions/RestaurantsActions';
import {AbstractStoreModel} from './AbstractStoreModel'
import {tourSource} from 'sources/TourSource';
import {ITourViewModel} from 'models/Tour';
import * as jquery from 'jquery';

interface IState {
    tours: Array<ITourViewModel>;
    errorMessage:string;
}

/**
 * Extending the state store in order to include aditional methods from
 * export Public methods and
 * export Async
 */
interface ExtendedStore extends AltJS.AltStore<IState> {
    fetchTours() : void;
    isLoading(): boolean;
    getTours(): Array<ITourViewModel>;
    getTour(id:number) : ITourViewModel;
}

class TourStore extends AbstractStoreModel<IState> implements IState {
    getTours():Array<ITourViewModel> {
        return this.tours;
    }

    getTour(id:number):ITourViewModel {
        if (!isNaN(id)) {
            if (this.tours) {
                return this.tours.find((r:ITourViewModel) => r.id === id);
            }
        }

        return null;
    }

    tours:Array<ITourViewModel>;
    errorMessage:string;

    constructor() {
        super();
        this.tours = [];
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
            getTours: this.getTours,
            getTour: this.getTour
        });

        this.exportAsync(tourSource);
    }

    handleUpdate(restaurants:Array<ITourViewModel>) {
        this.tours = restaurants;
        this.errorMessage = null;
        this.updateState();
    }

    handleFetch() {
        this.tours = [];
        this.updateState();
    }

    handleFailed(errorMessage:string) {
        this.errorMessage = errorMessage;
        this.updateState();
    }

    handleAdd(name:ITourViewModel):void {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/tours', false);

        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(JSON.stringify(name));

        name.id = xhr.response;
        this.tours.push(name);

        this.updateState();
    }

    handleDelete(name:ITourViewModel):void {
        var indexOf = this.tours.indexOf(name);
        if (indexOf >= 0) {
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/api/restaurants/${name.id}`, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.onload = (ev:Event)=> {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log(xhr.response);
                    tourStore.fetchTours();
                } else {
                    const responseText = ( <any>ev.target).responseText;
                    console.log('Error !' + responseText);
                    this.errorMessage = responseText;
                }
            };
            xhr.send();

            this.tours.splice(indexOf, 1);
            this.updateState();
        }
    }

    handleSave(name:ITourViewModel):void {
        this.tours.push(name);

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `/api/restaurants/${name.id}`, true);

        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = (ev:Event)=> {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.response);
                tourStore.fetchTours();
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
            tours: this.tours,
            errorMessage: this.errorMessage
        });
    }
}

export const tourStore = <ExtendedStore>flux.createStore<IState>(TourStore, "TourStore");