# Location
```json
{
  "title": "Location",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1,
      "readonly": true
    },
    "name": {
      "type": "string",
    },
    "streetAddress": {
      "type": "string",
    },
    "addressCountry": {
      "description": "The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code"
      "type": "string",
    },
    "postalCode": {
      "type": "string",
    },
    "city": {
      "type": "string",
    },
    "latitude": {
      "type": "number",
    },
    "longitude": {
      "type": "number",
    },    
  },
  "required": [
    "name",
    "latitude",
    "longitude"
  ]
}
```

# Restaurant
```json
{
  "title": "Restaurant",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1,
      "readonly": true
    },
    "name": {
      "type": "string",
      "readonly": true
    },
    "locationId": {
      "type": "integer"
    },    
    "timelines": {
      "type": "array",
      "items": {
        "type": "Timeline"
      },
      "minItems": 1
    }
  },
  "required": [
    "name",
    "location",
    "timelines"
  ]
}
```
# Timeline
```json
{
  "title": "Timeline",
  "type": "object",
  "properties": {
    "from": {
      "type": "string",
      "format": "date-time"
    },
    "until": {
      "type": "string",
      "format": "date-time"
    },
    "notes": {
      "description": "The country. For example, USA. You can also provide the two-letter ISO 3166-1 alpha-2 country code"
      "type": "string",
      "readonly": true
    },
    "phone": {
      "type": "string",
      "readonly": true
    },
    "businessHours": {
      "type": "array",
      "items": {
        "type": "BusinessHour"
      },
      "readonly": true
    }
  },
  "required": [
    "from",
    "until"    
  ]
}
```
# BusinessHour
```json
{
  "title": "BusinessHour",
  "type": "object",
  "properties": {
    "weekday": {
      "type": "string",
      "readonly": true
    },
    "from": {
      "type": "Hour",
      "readonly": true
    },
    "until": {
      "type": "Hour",
      "readonly": true
    }
  },
  "required": [
    "weekday",
    "from",
    "until"    
  ]
}
```

# Hour
```json
{
  "title": "Hour",
  "type": "object",
  "properties": {
    "hour": {
      "type": "integer"
    },
    "minute": {
      "type": "integer"
    }
  },
  "required": ["hour", "minute"]
}
```

# Tour
```json
{
  "title": "Tour",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string"
    },
    "timelines": {
      "type": "array",
      "items": {
        "type": "TourTimeline"
      },
      "minItems": 1
    }
  },
  "required": [
    "name", 
    "timelines"
  ]
}
```

# TourTimeline
```json
{
  "title": "TourTimeline",
  "type": "object",
  "properties": {
    "from": {
      "type": "string",
      "format": "date-time"
    },
    "until": {
      "type": "string",
      "format": "date-time"
    },
    "types": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": { "Morning", "Evening", "FullDay", "Afternoon", "Holiday" }
      },
      "minItems": 1
    },
    "difficulty": {
      "type": {
        "enum": [ "Easy", "Medium", "Hard", "VeryHard" ]
      }
    },
    "distance": {
      "type": "number"
    },
    "startRouteId": {
      "type": "number"
    },
    "locations": {
      "type": "array",
      "items": {
        "type": "Location"
      },
      "minItems": 5
    },
    "restaurantLocationId": {
      "type": "number"
    },
    "files": {
      "type": "array",
      "items": {
        "type": "any"
      }
    }
  },
  "required": [
    "from",
    "until",
    "types", 
    "difficulty", 
    "distance", 
    "startRouteId", 
    "locations", 
    "restaurantLocationId"
  ]
}
```

# StartRoute
```json
{
  "title": "TourTimeline",
  "type": "object",
  "properties": {
    "id": {
      "type": "number"
    },
    "name": {
      "type": "string"
    },
    "timelines": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "from": {
            "type": "string",
            "format": "date-time"
          },
          "until": {
            "type": "string",
            "format": "date-time"
          },
          "locations": {
            "type": "array",
            "items": {
              "type": "Location"
            },
            "minItems": 5
          }
        },
        "required": [
          "from",
          "until",
          "locations"
        ]
      }
    }
  },
  "required": [
    "timelines"
  ]
}
```

# Season
```json
{
  "title": "Season",
  "type": "object",
  "properties": {
    "year": {
      "type": "number"
    },
    "version": {
      "type": "number"
    },
    "configurationId": {
      "type": "number"
    },
    "tours": {
      "type": "array",
      "items": {
        "type": "SeasonTour"
      }
    }
  },
  "required": [
    "year",
    "version",
    "tours"
  ]
}
```
# SeasonTour 
```json
{
  "title": "SeasonTour",
  "type": "object",
  "properties": {
    "date": {
      "type": "string",
      "format": "date-time"
    },
    "tourId": {
      "type": "number"
    },
    "scores": {
      "type": "array",
      "items" : {
        "type": "object",
        "properties": {
          "type": {
            "type": "string"
          },
          "score": {
            "type": "number"
          },
          "notes": {
            "type": "string"
          }
        },
        "required": [ "type", "score" ]
      }
    }
  },
  "required": [ 
    "date", 
    "tourId", 
    "scores" 
  ] 
}
```

# SeasonConfiguration
```json
{
  "title": "SeasonConfiguration",
  "type": "object",
  "properties": {
    "id": {
      "type": "number"
    },
    "start": {
      "type": "string",
      "format": "date-time"
    },
    "end": {
      "type": "string",
      "format": "date-time"
    },
    "eveningStart": {
      "type": "string",
      "format": "date-time"
    },
    "eveningEnd": {
      "type": "string",
      "format": "date-time"
    },
    "vacationStart": {
      "type": "string",
      "format": "date-time"
    },
    "vacationEnd": {
      "type": "string",
      "format": "date-time"
    },
    "dailyStart": {
      "type": "string",
      "format": "date-time"
    },
    "dailyEnd": {
      "type": "string",
      "format": "date-time"
    },
    "holidays": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "date-time"
      }
    },
  "required": [
    "start",
    "end",
    "eveningStart",
    "eveningEnd",
    "vacationStart",
    "vacationEnd",
    "dailyStart",
    "dailyEnd",
    "holidays"
  ]
}
```