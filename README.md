# RESTO FINDER
RESTO FINDER is a web assistant app that allows you to browse restaurants in your neighborhood and allows you to search both by cuisine or by restaurant name. The application can be customized to deliver the best restaurants (i.e. those with the best ratings) or the cheapest restaurants (i.e. those with the lowest prices.

## Technology:
The app uses:
- Javascript framework: `knockout.js`
- APIs: `Google Maps` and `Zomato API`from [Zomato.com](https://developers.zomato.com/api)
- Front-end library: `Bootstrap`

## Code
The code is composed of 5 files:
- HTML: `index.html` 
- CSS: `style.css` 
- JS : `knockout-3.4.2.js` which loads the knockout.js framework
       `app.js` main application file
       `restaurant.class.js`which contains the class restaurant with its properties and methods
       `google.styles.js` which contains customized styles for the Google Maps component.

## Features
**RESTO FINDER** is an web app that assists you in finding the optimal restaurant for your preferences. Its main features are:
- It inially loads the 40 restaurants with the highest ratings in the city of Boston and place for each restaurant a marker on the map.
- You can search among the list of restaurants for the restaurant of your choice and show its properties.
- You can search restaurants offering a given cuisine. You can browse a list of cuisines and select one of them. Once selected, the app reacts by displaying markers on the map of all restaurants offering your chosen cuisine.
- By clicking on a marker on the map, an information window pops up where you can read the name of the restaurant, its address, its rating, the price for two as well as the different cuisines it offers. 
- The app is fully responsive and works on different screens.

## APIs
Google Maps API is used here to show the map and generate the markers etc.
Zomato API is used to provide information about the nearby restaurants in Boston as well as all information about them such as rating, price for two, address and so on. Unfortunately, Zomato does not provide photos for the restaurants.

## Installation and test drive
Download this repository, unzip it and then open the index.html file in your favorite browser.
You can run the application for a different city than Boston by changing the variables starting by `currentCity` in `app,js`:
`currentCity_name` for the name of the city, `currentCity_lat` and `currentCity_lng` for the latitude and longitude coordinates of the city, `currentCity_zid` which is the Zomato id of your city. You can find the Zomato id of you city by visiting [Zomato documentation](https://developers.zomato.com/documentation).

For instance, you can try to run the app for the city of New York. Use the following details:
`currentCity_name = "New York`;
`currentCity_lat=40.758896`
`currentCity_lng= -73.985130`
`currentCity_zid=280`

##  Check the App live!
You can use RESTO FINDER  [here](https://monty-nietzsche.github.io/Resto-Finder-App/).

## Others:
In the early development phases of this project, I  was inspired by gmawji neighborhood map project that you can find [here](https://bit.ly/2IwW4Th). Thanks gmawji!
