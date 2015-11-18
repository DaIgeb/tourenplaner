import {IIdentifyable, ILocation, IDateRange, ITime} from './Core';
import {IRestaurant} from "./Restaurant";

interface ITour {
    name: string;
    timelines: ITourTimeline[];
}

export interface ITourDataModel extends ITour, IIdentifyable<number> {
    id: number;
    timelines: ITourTimelineDataModel[];
}

interface ITourTimeline extends IDateRange {
    tourTypes: TourType[];
    difficulty: Difficulty;
    distance: number;
    tourStartRoute: number | ITourStart;
    points: IPoint[];
    preferredRestaurant: number | IRestaurant;
    files: IFile[];
}

export interface IPoint extends ILocation {
    id?: number;
    name: string;
}

interface ITourTimelineDataModel extends ITourTimeline, IIdentifyable<number> {
    tourTypes: TourType[];
    difficulty: Difficulty;
    distance: number;
    tourStartRoute: number;
    points: IPoint[];
    preferredRestaurantPoint: number;
    files: IFile[];
}

interface IFile {
    name: string;
    fileType: FileType,
    encoding: string;
    content: any;
}

export enum Difficulty {
    Easy,
    Medium,
    Hard,
    VeryHard
}

export enum FileType {
    GoogleMaps,
    Document,
    GarminTcx
}

export enum TourType {
    Evening,
    Afternoon,
    Morning,
    PublicHoliday
}

export interface ITourViewModel extends ITour {
    id?: number;
    timelines: ITourTimelineViewModel[];
}

export interface ITourTimelineViewModel extends ITourTimeline {
    tourTypes: TourType[];
    difficulty: Difficulty;
    distance: number;
    tourStartRoute: ITourStart;
    points: IPoint[];
    preferredRestaurantPoint: IPoint;
    files: IFile[];
}

class TourBase implements ITour {
    constructor(tour?:ITour) {
        if (tour) {
            this.name = tour.name;
            // create a copy of the timelines
            this.timelines = tour.timelines.slice(0);
        }
    }

    name:string;
    timelines:ITourTimeline[];
}

export class TourViewModel extends TourBase implements ITourViewModel {
    constructor(tour:ITourDataModel, findTour:((id:number) => ITourStart)) {
        super(tour);

        this.id = tour.id;
        this.timelines = tour.timelines.map(t => new TourTimelineViewModel(t, findTour));
    }

    id:number;
    timelines:ITourTimelineViewModel[];
}

class TimelineBase implements ITourTimeline {
    constructor(timeline:ITourTimeline) {
        this.tourTypes = timeline.tourTypes.slice(0);
        this.points = timeline.points.slice(0);
        this.files = timeline.files.slice(0);
        this.difficulty = timeline.difficulty;
        this.distance = timeline.distance;
        this.tourStartRoute = timeline.tourStartRoute;
        this.preferredRestaurant = timeline.preferredRestaurant;
        this.from = timeline.from;
        this.until = timeline.until;
    }

    tourTypes:TourType[];
    difficulty:Difficulty;
    distance:number;
    points:IPoint[];
    files:IFile[];
    from:moment.Moment;
    until:moment.Moment;

    tourStartRoute:number | ITourStart;
    preferredRestaurant:number | IRestaurant;
}

export interface ITourStart {
    id: number;
    name: string;
    timelines: ITourStartTimeline[];
}
interface ITourStartTimeline extends IDateRange {
    points: IPoint[];
}

export class TourTimelineViewModel extends TimelineBase implements ITourTimelineViewModel {
    constructor(timeline:ITourTimelineDataModel, findTour:((id:number) => ITourStart)) {
        super(timeline);

        this.tourStartRoute = findTour(timeline.tourStartRoute);
        this.preferredRestaurantPoint = timeline.points.find(p => p.id === timeline.preferredRestaurantPoint);
    }

    tourStartRoute:ITourStart;
    preferredRestaurantPoint:IPoint;
}

