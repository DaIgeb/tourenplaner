# Restaurants

## List
~~* Show business-hours~~
* Translate weekdays in businhess hours (see src/components/Restaurant/RestaurantBusinessHours.tsx line 58 for example)
~~* Filter business-hours based on the timline filter~~
* Selecting should expand the row to show more details (e.g. business hours at a different date)
    
## Form
* Add the remaining properties
* Testing

# Points/Locations

## API
* Load
* Update from Restaurant api calls
* Ensure id's from restaurant and locations are unique
* Add

## List
* Simple table showing all points
* Add button to add new points

## Form
* Create form
* Add location based on maps integration

## Maps
* Integrate open-street-/google-map to show the point (call-out/separate page)
  ** https://github.com/tomchentw/react-google-maps
  ** http://react.rocks/tag/Map
  ** https://github.com/PaulLeCam/react-leaflet

# Tours

## API
* Load
* Save
* Add
* Delete

## List

## Form

# Season

## Configuration

## List

## Version compare

## Score-Building
* Shorter Tours at the beginning/end of the season
 * Normal Distribution for evening tours https://en.wikipedia.org/wiki/Normal_distribution
 * For Weekends slowly increase from 60km to 85km until the evening tour starts then keep 85km to 95km as desired tour length
 * Calculate the evelation in with the distance 1km of climbin = 10km of distance ==> distance + evevation*10 = effectiveDistance
* Number of matching locations for previous tour
* Number of time used within the season
* Is Restaurant available

## Print-layout
* See [Season](http://rvwinterthur.ch/fileadmin/user_upload/Tourenfahren/2015/RVW_Tourenprogramm_2015.pdf) and [Tour-List](http://rvwinterthur.ch/fileadmin/user_upload/Tourenfahren/2015/RVW_Tourenbeschrieb_2015.pdf) for the final look

# General
* Switch to guid-ids
* Add backend (db, file)

# Cleanup
* Remove all examples from the original project

