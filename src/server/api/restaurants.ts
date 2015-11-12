import {MyRequestObject} from '../model';
import * as express from 'express';
import {moment} from 'utils/moment';
import {IRestaurant} from 'models/Restaurant';

export var router = express.Router();

const rest1:IRestaurant = {
    id: 1,
    name: "Hirschen",
    address: "Foobar",
    zipCode: "1",
    city: "Hagenbuch",
    location: {
        long: 47.523741,
        lat: 8.837266
    },
    data: [
        {
            businessHours: [
                {
                    weekday: "Monday",
                    from: {
                        hour: 8,
                        minute: 0
                    },
                    until: {
                        hour: 20,
                        minute: 0
                    }
                },
                {
                    weekday: "Tuesday",
                    from: {
                        hour: 8,
                        minute: 0
                    },
                    until: {
                        hour: 20,
                        minute: 0
                    }
                },
                {
                    weekday: "Friday",
                    from: {
                        hour: 8,
                        minute: 0
                    },
                    until: {
                        hour: 23,
                        minute: 0
                    }
                }
            ],
            phone: "052 722 12 34",
            notes: "Dienstags Ruhetag",
            from: moment(new Date(1970, 1, 1)),
            until: moment(new Date(2000, 12, 31))
        }, {
            businessHours: [
                {
                    weekday: "Monday",
                    from: {
                        hour: 10,
                        minute: 0
                    },
                    until: {
                        hour: 20,
                        minute: 0
                    }
                },
                {
                    weekday: "Tuesday",
                    from: {
                        hour: 8,
                        minute: 0
                    },
                    until: {
                        hour: 20,
                        minute: 0
                    }
                },
                {
                    weekday: "Friday",
                    from: {
                        hour: 8,
                        minute: 0
                    },
                    until: {
                        hour: 23,
                        minute: 0
                    }
                }
            ],
            phone: "052 722 12 34",
            notes: "Dienstags Ruhetag",
            from: moment(new Date(2001, 1, 1)),
            until: null
        }
    ]
};

const rest2:IRestaurant = {
    id: 2,
    name: "Sonne",
    address: "Foobar",
    zipCode: "2",
    city: "Warth",
    location: {
        long: 12345.123,
        lat: 123541.123
    },
    data: [
        {
            businessHours: [
                {
                    weekday: "Monday",
                    from: {
                        hour: 8,
                        minute: 0
                    },
                    until: {
                        hour: 20,
                        minute: 0
                    }
                }
            ],
            phone: "052 722 12 34",
            notes: "Dienstags Ruhetag",
            from: moment(new Date(1970, 1, 1)),
            until: moment(new Date(2000, 12, 31))
        }, {
            businessHours: [
                {
                    weekday: "Monday",
                    from: {
                        hour: 10,
                        minute: 0
                    },
                    until: {
                        hour: 20,
                        minute: 0
                    }
                }
            ],
            phone: "052 722 12 34",
            notes: "Dienstags Ruhetag",
            from: moment(new Date(2001, 1, 1)),
            until: null
        }
    ]
};
const rest3:IRestaurant = {
    id: 3,
    name: "Schäfli",
    address: "Foobar",
    zipCode: "3",
    city: "Ossingen",
    location: {
        long: 12345.123,
        lat: 123541.123
    },
    data: [
        {
            businessHours: [
                {
                    weekday: "Monday",
                    from: {
                        hour: 8,
                        minute: 0
                    },
                    until: {
                        hour: 20,
                        minute: 0
                    }
                }
            ],
            phone: "052 722 12 34",
            notes: "Dienstags Ruhetag",
            from: moment(new Date(1970, 1, 1)),
            until: moment(new Date(2000, 12, 31))
        }, {
            businessHours: [
                {
                    weekday: "Monday",
                    from: {
                        hour: 10,
                        minute: 0
                    },
                    until: {
                        hour: 20,
                        minute: 0
                    }
                }
            ],
            phone: "052 722 12 34",
            notes: "Dienstags Ruhetag",
            from: moment(new Date(2001, 1, 1)),
            until: null
        }
    ]
};

const mockData:IRestaurant[] = [rest1, rest2, rest3];

router.get('/', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(mockData);
});

router.put('/', (req:express.Request, res:express.Response, next:Function):any => {
    console.log(req.body);
    mockData.push(req.body);
    res.json(mockData);
});

router.post('/', (req:express.Request, res:express.Response, next:Function):any => {
    console.log(req.body);
    mockData.push(req.body);
    res.json(mockData);
});