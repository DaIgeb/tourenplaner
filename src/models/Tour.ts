interface ITour { 
  name: string;    
  timelines: ITourTimeline[];
}
interface ITourDataModel extends ITour {
    id: number;
    timelines: ITourTimelineDataModel[];
}

interface ITourTimeline extends IDateRange {
   tourTypes: TourType[];
   difficulty: Difficulty;
   distance: number;
   tourStartRoute: number | ITourStart; 
   points: IPoint[];
   preferredRestaurantPoint: number | IPoint;
   files: IFile[];
}

interface IPoint extends ILocation {
  id?: number;
  name: string;
}

interface ITourTimelineDataModel extends ITourTimeline {
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
  content: byte[];
}

enum Difficulty {
  Easy,
  Medium,
  Hard,
  VeryHard
}

enum FileType {
  GoogleMaps,
  Document,
  GarminTcx
}

enum TourType {
  Evening,
  Afternoon,
  Morning,
  PublicHoliday
}



// ViewModel

interface ITourViewModel extends ITour{
    id?: number;
    timelines: ITourTimelineViewModel[];
}

interface ITourTimelineViewModel extends ITourTimeline {
   tourTypes: TourType[];
   difficulty: Difficulty;
   distance: number;
   tourStartRoute: ITourStart; 
   points: IPoint[];
   preferredRestaurantPoint: IPoint;
   files: IFile[];
}

class TourBase implements ITour {
  constructor(tour?: ITour) {
    if (tour) {
      this.name = tour.name;
      // create a copy of the timelines
      this.timelines = tour.timelines.slice(0);
    }
  }
  
  name: string;
  timelines: ITourTimeline[];
}

export class TourViewModel extends TourBase implements ITourViewModel {
  constructor(tour: ITourDataModel) {
    super(tour);
    
    this.id = tour.id;
    this.timelines = tour.timelines.map(t => new TourTimelineViewModel(t));    
  }
  
  id?: number;
  timelines: ITourTimelineViewModel[];
}

class TimelineBase implements ITourTimeline {
  constructor(timeline: ITourTimeline) {
    this.tourTypes = timeline.tourTypes.slice(0);
    this.points = timeline.points.slice(0);
    this.files = timeline.files.slice(0);
    this.difficulty = timeline.difficulty;
    this.distance = timeline.distance;
    this.tourStartRoute = timeline.tourStartRoute;
    this.preferredRestaurantPoint = timeline.preferredRestaurantPoint;
  }
  
  tourTypes: TourType[];
  difficulty: Difficulty;
  distance: number;
  points: IPoint[];
  files: IFile[];
  
  tourStartRoute: number | ITourStart; 
  preferredRestaurantPoint: number | IPoint;  
}

interface ITourStart {
  id: number;
  name: string;
  timelines: ITourStartTimeline[];  
}
interface ITourStartTimeline extends IDateRange {
  points: IPoint[];
}

export class TourTimelineViewModel implements ITourTimelineViewModel {
  constructor(timeline: ITourTimelineDataModel, findTour: ((id: number) => ITourStart)) {
    super(timeline);
    
    tourStartRoute = findTour(timeline.tourStartRoute);
    preferredRestaurantPoint = timeline.points.find(p => p.id === timeline.preferredRestaurantPoint);
  }
  
  tourStartRoute: ITourStart;
  preferredRestaurantPoint: IPoint;
}

