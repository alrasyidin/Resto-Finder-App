/**
 * restaurant  is a class, where all the important details of a restaurant are defined as properties
 * The class has also three methods:
 * getMarker() which returns the marker related to the restaurant object. 
 * getInfo() which returns the HTML content of the infoWindow related to ther restaurant's marker
 * getNameAndPrice() returns the name of restaurant followed by its price between parentheses
 * @class
 */
class restaurant {
    constructor(id, zid, name, address, latitude, longitude, cuisines, averageCost, rating, ratingText) {

        this.id = parseInt(id);
        this._zid = parseInt(zid);
        this._name = name;
        this._address = address;
        this._latitude = parseFloat(latitude);
        this._longitude = parseFloat(longitude);
        this._cuisines = cuisines;
        this._averageCost = parseFloat(averageCost);
        this._rating = rating;
        this._ratingText = ratingText;
        this._photo = "img/restaurant.png";

        // Create a marker for the current restaurant and associate with it
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(this._latitude, this._longitude),
            map: map,
            title: this._name,
            //label:"$"+this._averageCost,
            icon: 'img/marker_green.png',
            animation: google.maps.Animation.DROP,
            id: this.id
        });
        this._marker = marker;

    }
    getMarker() {
        return this._marker;
    }

    getInfo() {
        // Create the information to be displayed in the infoWindow and associate it with the 
        // current restaurant
        let zomatoInfo = '<div>' + '<h5 class="iw-title">' + this._name.toUpperCase() + '</h5>' +
            '<div class="iw-cuisine"> <i class="fas fa-utensils"></i>  ' + this._cuisines + '</div>' +
            '<img src =' + this._photo + '>' +
            '<div class="iw-address"><i class="fas fa-envelope"></i> ' + this._address + '</div>' +
            '<div class="iw-cost"><i class="fas fa-dollar-sign"></i> Price for two:  $' + this._averageCost + '</div>' +
            '<div class="iw-rating"><i class="fas fa-star"></i> Rating:  ' + this._ratingText + ' [' + this._rating + '/5]' + '</div>' +
            '</div>';
        console.log(zomatoInfo);
        return zomatoInfo;
    }

    getNameAndPrice() {
        return this._name + "[$" + this._averageCost + "]";
    }

}