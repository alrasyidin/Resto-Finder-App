// Global Variables
let map, clientID, clientSecret;

// These are the default configuration details. These include the coordinates of the
// city, its zomato id (currentCity_zid) as well as Zomato API key
let currentCity_lat = 42.3511970000;
let currentCity_lng = -71.0631100000;
let currentCity_type = "city";
let currentCity_zid = 289;
let currentCity_name = "Boston";

const ZOMATO_KEY = "ebf7e2efeaff9bf1098bcd40231d13e3"; //"8b219c6ffaf9d828aa343abec62e068b"; //

function AppViewModel() {
    let self = this;

  /** @description declaration of observable variables and arrays
     *  @param searchCuisine : User search input for the cuisine
     *  @param searchRestaurant : User search input for the restaurant
     *  @param showSuggestions : toggles the suggestions' list on the cuisine search field
     *  @param sortedBy : specifies whether the restaurant search is operated by rating or price
     *  @param selectedCuisine : contains the ID of the cuisine selected by the user
     *  @param oldSorting : holds the latest choice of self.sortedBy
     *  @param filteredCuisines : holds the cuisines corresponding to the user search input
     *  @param filteredRestaurants : holds the restaurants corresponding to the user search input
**/
    this.searchCuisine = ko.observable("");
    this.searchRestaurant = ko.observable("");
    this.showSuggestions = ko.observable(false);
    this.sortedBy = ko.observable("rating");
    this.selectedCuisine = ko.observable(0);
    this.oldSorting = "rating";
    this.filteredCuisines = ko.observableArray([]);
    this.filteredRestaurants = ko.observableArray([]);

        // These arrays contain the list of cuisines and restaurants
        this.cuisines = [];
        this.restaurants = [];

    // Declare a unique infoWindow to be used by all markers
    this.markerInfo = new google.maps.InfoWindow({
        maxWidth: 165
    });
    this.markerInfo.addListener('closeclick', function() {
        this.marker = null;
    });

    /** 
     *  @function initMap
     *  @description initializes the application. It loads the Google Maps' map as well
     *  initializes the arrays of cuisines and restaurants. The map is centered on the current
     *  city using the following parameters:
     *  @param currentCity_lat specifies the latitude of the current city
     *  @param currentCity_lng specifies the longitude of the current City.
     *   **/
    this.initMap = function() {

        // Load the map centered on the current City (Boston)
        let currentCity = new google.maps.LatLng(currentCity_lat, currentCity_lng);
        let mapCanvas = document.getElementById('map');
        let mapOptions = {
            center: currentCity,
            zoom: 14,
            styles: styles
        };

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(mapCanvas, mapOptions);

        // Load the data of all cuisines in CurrentCity
        self.loadCuisines();

        // Load the 40 restaurants with either the highest rating/lowest price depending
        // on the input of the user.
        self.loadRestaurants();
    };

    /** 
     *  @function loadCuisines
     *  @description connects to the Zomato API and download an associative array of
     *  all cuisines available in the current city (currentCity).
     *   **/
    this.loadCuisines = function() {
        $.ajax({
            url: "https://developers.zomato.com/api/v2.1/cuisines?city_id=" + currentCity_zid,
            headers: {
                "user-key": ZOMATO_KEY
            },
        }).done(function(data) {
            for (i = 0; i < data.cuisines.length; i++) {
                self.cuisines.push(data.cuisines[i].cuisine);
            }
        }).fail(function() {
            alert("An error occured while loading Zomato API. Please refresh and try again later!")
        })

    }

    /** 
     *  @function loadRestaurants
     *  @description connects to the Zomato API and download an associative array of
     *  at most 40 restaurants available in the current city (currentCity). The restaurants
     *  in the array depends on several parameters:
     *   @param self.selectedCuisine if the user has selected a specific cuisine
     *   @param self.sortedBy which takes two values "rating" or "price". It it is equal to 
     *  "price" then restaurants are selected in ascending prices. If it is equal to "rating"
     *  the restaurants are selected in decreasing rating score.
     *   **/
    this.loadRestaurants = function() {

        // Depending on the user input, we find the first 40 restaurants in our currentCity

        for (let i = 0; i < 2; i++) {

            // Construct the query based on the user input
            let query = " https://developers.zomato.com/api/v2.1/search?entity_id=" + currentCity_zid +
                "&entity_type=" + currentCity_type + "&latitude=" + currentCity_lat + "&longitude=" + currentCity_lng +
                "radius=4000&start=" + 20 * i + "&count=20"
            if (self.selectedCuisine() != 0) {
                query = query + "&cuisines=" + self.selectedCuisine();
            }
            if (self.sortedBy == "rating") {
                query = query + "&sort=rating&order=desc";
            } else {
                query = query + "&sort=cost&order=asc";
            }
            console.log(query);

            //Fetch the data of the restaurants from the Zomato API
            $.ajax({
                url: query,
                headers: {
                    "user-key": ZOMATO_KEY
                }
            }).done(function(data) {

                if (data.restaurants.length > 0) {

                    // If there is a new data available, erase all markers currently present on the map 
                    for (i = 0; i < self.restaurants.length; i++) {
                        let pin = self.restaurants[i].getMarker();
                        pin.setMap(null);
                    }
                    self.restaurants = [];
                    self.filteredRestaurants([]);

                    // 

                    for (let i = 0; i < data.restaurants.length; i++) {

                        // Create an array of restaurant objects
                        restaurang = data.restaurants[i].restaurant;
                        let resto = new restaurant(i, restaurang.id, restaurang.name, restaurang.location.address + " (" + restaurang.location.locality +
                            ") ", restaurang.location.latitude, restaurang.location.longitude, restaurang.cuisines, restaurang.average_cost_for_two,
                            restaurang.user_rating.aggregate_rating, restaurang.user_rating.rating_text);
                        self.restaurants.push(resto);
                        self.filteredRestaurants.push(resto);

                        // Get the markers from the restaurant objects and place them on the map
                        let marker = resto.getMarker();
                        marker.setMap(map);
                        marker.addListener('click', self.showInfo);

                    }
                }
            }).fail(function() {
                // Send alert if there was an error loading the Zomato API
                alert("An error has occured while  loading the Zomato API. Please refresh your page to try again.");
            });

            // If there are no restaurants serving the collected cuisine, clear the cuisine research field and set 
            // selectedCuisine to 0 i.e. the code relative to all cuisines.
            if (self.restaurants.length == 0) {
                self.searchCuisine("");
                self.selectedCuisine(0);
            }
        }
    }

    this.initMap();

    /** 
     *  @function showInfo
     *  @description  loads the information collected from the restaurant object through
     *  the method (restaurant.getInfo()) and place  it in the infowindow, which is called 
     *  self.markerInfo.
     *   @param this.id which is either the id of a restaurant or of marker. Both work since
     *   a marker belonging to a restaurant inherits its id (see the restaurant class).
     *   **/
    this.showInfo = function() {

        // Using the id of the marker/restaurant, find the corresponding restaurant object and use it
        // to collect info about the restaurant itself.
        let currentMarker = self.restaurants[this.id].getMarker();
        let currentInfo = self.restaurants[this.id].getInfo();
        self.markerInfo.setContent(currentInfo);

        // Open the infowindow 
        self.markerInfo.open(map, currentMarker);

        // Bounce the marker for 800 ms
        currentMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            currentMarker.setAnimation(null);
        }).bind(this), 800);
    }

        /** 
     *  @function showSelected
     *  @description  treats the events following the clicking of a cuisine by the user
    *   Once it is clicked, the observable searchCuisine is set to the selectedCuisine
    *   The suggestions list is hidden and the restaurants are loaded on the map.
     *   @param cuisine the cuisine object {cuisine_id: , cuisine_name:} is sent from the
     *    view. Its Id (cuisine.id) will serve later to make searches of restaurant having 
     *   the cuisine specified in cuisine.id.
     *   **/
    this.showSelected = function(cuisine) {
        self.searchCuisine(cuisine.cuisine_name);
        self.selectedCuisine(cuisine.cuisine_id);
        self.showSuggestions(false);
        self.loadRestaurants();
    }

     /** 
     *  @function sorting
     *  @description  checks if there has been a change in the sorting choice of the
    *    user i.e. rating or price. It achieves this by comparing the two parameters:
    *   @param self.sortedBy which captures the current sorting choice
    *   @param self.oldSorting which captures the previous sorting choice
    *   **/
    this.sorting = ko.computed(function() {
        if (self.sortedBy() != self.oldSorting) {
            self.oldSorting = self.sortedBy();
            self.loadRestaurants();
        }
    }, this);

    /** 
     *  @function findCuisine
     *  @description  tries to find cuisines that fit the user input. If there is a change in
     *  @param searchCuisine observable (user Input), it is checked whether there is a 
     *  cuisine on the list starting with the user input, if there is none, the last entered 
     *  character is deleted. If there are choices in the list starting with the  user Input
     *  then the suggestions list is shown (@param self.showSuggestions is set to true)
     *  , unless the user Input is empty (@param self.searchCuisine is an empty string.)
    *   **/
    this.findCuisine = ko.computed(function() {
        if (self.searchCuisine()) {
            const filtereddata = self.cuisines.filter(cuisine => cuisine.cuisine_name.toLowerCase().startsWith(self.searchCuisine().toLowerCase()));
            self.filteredCuisines(filtereddata);
            if (filtereddata.length == 0) {
                self.searchCuisine(self.searchCuisine().substr(0, self.searchCuisine().length - 1));
            }
            if (self.searchCuisine().length > 0) {
                self.showSuggestions(true);
            } else {
                self.showSuggestions(false);
            }
        }
    }, this);

    /** 
     *  @function findRestaurant
     *  @description   finds restaurants whose names contain the user search input 
     *  (@param self.searchRestaurant) . 
    *   **/
    this.findRestaurant = ko.computed(function() {
        if(self.searchRestaurant()==""){
            self.filteredRestaurants(self.restaurants);
        } else {
            self.filteredRestaurants(self.restaurants.filter(restaurant => restaurant._name.toLowerCase().includes(self.searchRestaurant().toLowerCase())));
        }
        
    }, this);


}
    /** 
     *  @function googleError
     *  @description   displays an error if Google Maps fails to load.
    *   **/
googleError = function googleError() {
    alert(
        'Oops. Google Maps did not load. Please refresh the page and try again!'
    );
};

function startApp() {
    ko.applyBindings(new AppViewModel());
}