function initMap(locations = allLocations) {
  var bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    mapTypeId: cslMaptype, 
    mapTypeControl: false,
  };
  var map = new google.maps.Map(document.getElementById('locations-near-you-map'), mapOptions);
  map.setTilt(45);

  var markers = new Array();
  var infoWindowContent = new Array();
  // var markerclusterer = null;
  locations.forEach(function(location) {   
    let locaddress = (location.address !== "") ? location.address + '<br /> ' : "";
    let loczip = (location.zip !== "") ? location.zip + '<br /> ' : "";
    let locphone = (location.phone !== "") ? location.phone + '<br /> ' : "";
    let locfax = (location.fax !== "") ? location.fax + '<br /> ' : "";
    let locwebsite = (location.website !== "") ? location.website + '<br /> ' : "";
    let directionlink  = "https://www.google.com/maps/dir/?api=1&destination=" + location.lat + ", " + location.lng;
    infoWindowContent.push(['<div class="infoWindow"><h3>' + location.name + '</h3><p>' + 
      locaddress + 
      loczip + 
      locphone + 
      locfax +
      locwebsite + 
      '</p><a class="directionlink" href="' + directionlink + '" target="_blank">Get Direction<a><a class="streetviewlink directionlink" href="#1" onClick="streetviewfun(' + location.lat + ', ' + location.lng + ');">Street View</a></div>']);
  });	    



  


  var infoWindow = new google.maps.InfoWindow(), marker, i, position;

  var markersC = [];

  for (i = 0; i < locations.length; i++) {
    var position = new google.maps.LatLng(locations[i]['lat'], locations[i]['lng']);
    bounds.extend(position);
    if(clsIcon !== "")
    {
      var myicon = {
        position:  new google.maps.LatLng(locations[i]['lat'], locations[i]['lng']),
        url: clsIcon,
        scaledSize: new google.maps.Size(30, 30),

      };

      marker = new google.maps.Marker({
        position:  new google.maps.LatLng(locations[i]['lat'], locations[i]['lng']),
        icon: myicon,
        map: map,
        title: locations[i]['name'],
        myid: i
      });
    }
    else
    {
      marker = new google.maps.Marker({
        position:  new google.maps.LatLng(locations[i]['lat'], locations[i]['lng']),
        map: map,
        title: locations[i]['name'],
        myid: i
      });
    }
    
    // Add an infoWindow to each marker, and create a closure so that the current
    // marker is always associated with the correct click event listener
    
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
    
          map.panTo(this.getPosition());
            map.setZoom(14);
      
          infoWindow.setContent(infoWindowContent[i][0]);
          infoWindow.open(map, marker);

     //     animateMapZoomTo(map, 14);
        
    }
    })(marker, i));

    // Only use the bounds to zoom the map if there is more than 1 location shown
    if(locations.length > 1) {
      map.fitBounds(bounds);
    } else {
      var center = new google.maps.LatLng(locations[0].lat, locations[0].lng);
      map.setCenter(center);
      map.setZoom(15);
    }

    // Add marker to markers array
    markers.push(marker);
    markersC.push(marker);

  }

 // Add a marker clusterer to manage the markers.
 var options_markerclusterer = {
  gridSize: 20,
  maxZoom: 16,
  zoomOnClick: true,
  minimumClusterSize: 2,
  imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
};


  // the smooth zoom function
  function animateMapZoomTo(map, targetZoom) {
    var currentZoom = arguments[2] || map.getZoom();
    if (currentZoom != targetZoom) {
        google.maps.event.addListenerOnce(map, 'zoom_changed', function (event) {
            animateMapZoomTo(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 1 : -1));
        });
        setTimeout(function(){ map.setZoom(currentZoom) }, 80);
    }
  }

  var markerCluster = new MarkerClusterer(map, markersC, options_markerclusterer);

  
  jQuery('.marker-link').on('click', function (e) {
    e.preventDefault();
    console.log(jQuery(this).attr('data-markerid'));
    google.maps.event.trigger(markers[jQuery(this).attr('data-markerid')], 'click');

    document.getElementById("locations-near-you-map").style.display="block";
    document.getElementById("pano").style.display="none";

  });

  /*
  document.querySelectorAll(".marker-link").addEventListener("click", function() {
    alert(this.getAttribute('data-markerid'));
  });
  */
  


}


function streetviewfun(latitude, longitude) {
  const fenway = { lat: latitude, lng: longitude };
  const map = new google.maps.Map(document.getElementById("pano"), {
    center: fenway,
    zoom: 14,
  });

  document.getElementById("togglemap").addEventListener("click", toggleStreetView);
  document.getElementById("floating-panel-map").style.display="block";
  
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: fenway,
      addressControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER,
      },
      pov: {
        heading: 34,
        pitch: 10,
      },
      linksControl: false,
      panControl: false,
      enableCloseButton: false,
    }
  );

  
  map.setStreetView(panorama);
  document.getElementById("locations-near-you-map").style.display="none";
  document.getElementById("pano").style.display="block";



}


function toggleStreetView() {

  document.getElementById("locations-near-you-map").style.display="block";
  document.getElementById("pano").style.display="none";
  document.getElementById("floating-panel-map").style.display="none";
}

/*
document.querySelector(".gm-iv-container button").addEventListener("click", function() {
console.log('test');
document.getElementById("locations-near-you-map").style.display="block";
document.getElementById("pano").style.display="none";
});


jQuery('.gm-iv-back').on('click', function () {
  console.log('test');
  jQuery('#locations-near-you-map').show();
  jQuery('#pano').hide();
});
*/




function filterLocations() {
jQuery(function($){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var userAddressparam = urlParams.get('userAddress');
  var maxRadius = urlParams.get('maxRadius');

  var userLatLng;
  var geocoder = new google.maps.Geocoder();
  if(userAddressparam)
  {
    var myuserAddress = userAddressparam.replace(/[^a-z0-9\s]/gi, '');
  }
  else
  {
    var myuserAddress = '';
  }
  var maxRadius = parseInt(maxRadius, 10);
  
  if (myuserAddress && maxRadius) {
    userLatLng = getLatLngViaHttpRequest(myuserAddress);
  } 


  function getLatLngViaHttpRequest(address) {
  
    // Set up a request to the Geocoding API
    // Supported address format is City, City + State, just a street address, or any combo
    var addressStripped = address.split(' ').join('+');
    
    var key = cslAPI;
    var request = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addressStripped + '&key=' + key;
    
    
    // Call the Geocoding API using jQuery GET, passing in the request and a callback function 
    // which takes one argument "data" containing the response
    
    $.get( request, function( data ) {
      var searchResultsAlert = document.getElementById('location-search-alert');
      var searchResultsAlertMap = document.getElementById('locations-near-you-map');
  
  
      // Abort if there is no response for the address data
  
      if (data.status === "ZERO_RESULTS") {
        document.getElementById('csl-wrapper').setAttribute("class", 'csl-wrapper no-locations');
        document.getElementById('csl-wrapper').innerHTML = '';
        searchResultsAlert.innerHTML = '<div class="nothing_found">No locations found in ' + address + '. Please search again.</div>';
        return;
        }
  
      var userLatLng = new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
      var filteredLocations = allLocations.filter(isWithinRadius);

      
      if (filteredLocations.length > 0) {
      //  initMap(filteredLocations);

      filteredLocations.forEach( function(location) {
        var distance = distanceBetween(location);
        location.distance = parseFloat(distance).toFixed(2);
      });
      filteredLocations.sort((x, y) => x.distance - y.distance);

        createListOfLocations(filteredLocations);
        
        searchResultsAlert.innerHTML = 'Locations near ' + address + ':';
      } else {
        console.log("nothing found!");
        console.log(address);
        document.getElementById('csl-wrapper').innerHTML = '';
        searchResultsAlert.innerHTML = 'Sorry, no locations were found near ' + address + '.';
    }
      
    function distanceBetween(location) {
      var locationLatLng = new google.maps.LatLng(location.lat, location.lng);
      var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(locationLatLng, userLatLng);
      return convertMetersToMiles(distanceBetween);
    }
    
    function isWithinRadius(location) {
      
      var locationLatLng = new google.maps.LatLng(location.lat, location.lng);
      var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(locationLatLng, userLatLng);
      return convertMetersToMiles(distanceBetween) <= maxRadius;
    }
  
      
    });  

  

  }

 
  


});



}




function convertMetersToMiles(meters) {
return (meters * 0.000621371);
}

function createListOfLocations(locations) {
var boundsa = new google.maps.LatLngBounds();
var mapOptions = {
  mapTypeId: cslMaptype, 
  mapTypeControl: false,
};

var newmarkers = new Array();
var infoWindowContentsearch = new Array();
var map = new google.maps.Map(document.getElementById('locations-near-you-map'), mapOptions);
map.setTilt(45);

const labels = "1234567890";


var locationsListb = document.getElementsByClassName('location-near-you-box');
// Clear any existing locations from the previous search first
locationsListb[0].innerHTML = '';
var i = 0;
var infoWindowsearch = new google.maps.InfoWindow();

locations.forEach( function(location) {
  var positiona = new google.maps.LatLng(locations[i]['lat'], locations[i]['lng']);
  boundsa.extend(positiona);
  var specificLocation = document.createElement('div');
  let locphone = (location.phone !== "") ? location.phone + '<br /> ' : "";
  let locfax = (location.fax !== "") ? location.fax + '<br /> ' : "";
  let locwebsite = (location.website !== "") ? location.website : "";
  let locaddress = (location.address !== "") ? location.address + '<br /> ' : "";
  let loczip = (location.zip !== "") ? location.zip + '<br /> ' : "";
  let locdistance = "<p class='distance'>" + location.distance + " Miles Away </p>";
  let directionlink  = "https://www.google.com/maps/dir/?api=1&destination=" + locations[i]['lat'] + ", " + locations[i]['lng'];
  let lochours = (location.hours !== "") ? location.hours + ' ' : "";

 
  
  var locationInfo = '<div data-markerid="'+ i +'" href="#1" class="marker-link">	<h4>' + location.name + '</h4><p>' + location.address + '<br />' + location.zip + '</p><p> ' + 
  locphone +
  locfax + 
  locwebsite + 
  '</p>' +  lochours +  locdistance  + '<a href="#1" class="viewmaplink"> View on Map</a></div></div>';
  specificLocation.setAttribute("class", 'csl-list-item');
  specificLocation.innerHTML = locationInfo;
  locationsListb[0].appendChild(specificLocation);

 

  infoWindowContentsearch.push(['<div class="infoWindow"><h3>' + location.name + 
  '</h3><p>' + locaddress + '<br />' + loczip + 
  locphone + 
  locfax + 
  locwebsite + '</p><a class="directionlink" href="' + directionlink + '" target="_blank">Get Direction<a></div>']);




  if(clsIcon !== "")
  {
  var myicon = {
    position:  new google.maps.LatLng(locations[i].lat, locations[i].lng),
    url: clsIcon,
    scaledSize: new google.maps.Size(30, 30),
  };

  markersearch = new google.maps.Marker({
    position:  new google.maps.LatLng(locations[i].lat, locations[i].lng),
    icon: myicon,
    map: map,
    title: location.name,
    myid: location.myid,
   // label: labels[i % labels.length]
  });
  }
  else
  {
    markersearch = new google.maps.Marker({
      position:  new google.maps.LatLng(locations[i].lat, locations[i].lng),
      map: map,
      title: location.name,
      myid: location.myid,
      label: labels[i % labels.length]
    });

  }

  google.maps.event.addListener(markersearch, 'click', (function(markersearch, i) {
    return function() {
      infoWindowsearch.setContent(infoWindowContentsearch[i][0]);
      infoWindowsearch.open(map, markersearch);
    }
  })(markersearch, i));

   if(locations.length > 1) {
    map.fitBounds(boundsa);
  } else {
    var center = new google.maps.LatLng(locations[i].lat, locations[i].lng);
    map.setCenter(center);
    map.setZoom(15);
  }

  newmarkers.push(markersearch);

  i++; });

   
  
  jQuery('.marker-link').on('click', function () {
    google.maps.event.trigger(newmarkers[jQuery(this).attr('data-markerid')], 'click');

    document.getElementById("locations-near-you-map").style.display="block";
    document.getElementById("pano").style.display="none";
    document.getElementById("floating-panel-map").style.display="none";
   });

   let imagePathb = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m";
  var clustermakera = new MarkerClusterer(map, newmarkers, {imagePath: imagePathb});

}

jQuery(function($){

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var userAddressparam = urlParams.get('userAddress');
if(userAddressparam !== "" && userAddressparam !== null)
{
filterLocations();
}
else
{
if(typeof allLocations !== 'undefined')
{
initMap();	
}
}

jQuery(".currentloc").on('click', function(){
  initGeolocation();
});

jQuery("#mapreset").on('click', function(){
//initMap();	
//createListOfLocations(allLocations);
window.location.replace(location.pathname);
});


});





function initGeolocation()
  {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        alert("Sorry, your browser does not support geolocation services.");
    }
  }

function successFunction(position)
{
      var mylongitude = position.coords.longitude;
      var mylatitude = position.coords.latitude;
      var maxRadius = parseInt(maxRadius, 10);

      var key = cslAPI;
      var request = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + mylatitude + ',' + mylongitude + '&key=' + key;
     // console.log(request);

      var userLatLng = new google.maps.LatLng(mylatitude, mylongitude);
      

          var filteredLocations = allLocations.filter(isWithinRadius);
          document.getElementById('csl-wrapper').classList.remove("no-locations");
          if (filteredLocations.length > 0) {	
            filteredLocations.forEach( function(location) {
              var distance = distanceBetween(location);
              location.distance = parseFloat(distance).toFixed(2);
            });
            filteredLocations.sort((x, y) => x.distance - y.distance);
            createListOfLocations(filteredLocations);
            var searchResultsAlert = document.getElementById('location-search-alert');
            
            searchResultsAlert.innerHTML = 'Locations near Me';

          } else {
            console.log("nothing found!");
            var searchResultsAlert = document.getElementById('location-search-alert');
            searchResultsAlert.innerHTML = 'Locations near Me';
            maxRadius = 5000;
            var filteredLocations = allLocations.filter(isWithinRadius);
            if (filteredLocations.length > 0) {
            filteredLocations.forEach( function(location) {
              var distance = distanceBetween(location);
              location.distance = parseFloat(distance).toFixed(2);
            });
            filteredLocations.sort((x, y) => x.distance - y.distance);
            var filteredLocations2 = filteredLocations.slice(0, 5);
            createListOfLocations(filteredLocations2);
            }else{
            document.getElementById('csl-wrapper').setAttribute("class", 'csl-wrapper no-locations');
            document.getElementById('location-near-you-box').innerHTML = '';
            document.getElementById('locations-near-you-map').innerHTML = '<div class="nothing_found">No locations found within the area. Please search again.</div>';
            }
          }

          function distanceBetween(location) {
            var locationLatLng = new google.maps.LatLng(location.lat, location.lng);
            var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(locationLatLng, userLatLng);
            return convertMetersToMiles(distanceBetween);
          }
          
          function isWithinRadius(location) {
            var locationLatLng = new google.maps.LatLng(location.lat, location.lng);
            var distanceBetween = google.maps.geometry.spherical.computeDistanceBetween(locationLatLng, userLatLng);
            return convertMetersToMiles(distanceBetween) <= maxRadius;
          }

          
        
     
      
    //    userLatLng = getLatLngViaHttpRequest(userAddress);
}
function errorFunction(err){
  console.warn(`ERROR(${err.code}): ${err.message}`);
}



