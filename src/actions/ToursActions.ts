import {flux} from 'shared/control';
import {AbstractActions} from "./AbstractActions";
import {ITourViewModel} from 'models/Tour'

class ToursActions extends AbstractActions implements IToursActions {
    constructor(alt:AltJS.Alt) {
        super(alt);
    }

    addTour(name:ITourViewModel):void {
        this.dispatch(name);
    }

    deleteTour(name:ITourViewModel):void {
        this.dispatch(name);
    }

    saveTour(restaurant:ITourViewModel):void {
        this.dispatch(restaurant);
    }

    updateTours(restaurants:Array<ITourViewModel>):void {
        this.dispatch(restaurants);
    }

    fetchTours():void {
        this.dispatch();
    }

    toursFailed(errorMessage:any):void {
        this.dispatch(errorMessage);
    }
}

interface IToursActions {
    addTour(name:ITourViewModel) : void;
    deleteTour(name:ITourViewModel) : void;
    saveTour(restaurant:ITourViewModel): void;
    updateTours(restaurants:Array<ITourViewModel>):void;
    fetchTours():void;
    toursFailed(errorMessage:any): void;
}

export const actions = flux.createActions<IToursActions>(ToursActions);