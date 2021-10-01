import './App.css';
import * as satellite from "satellite.js";
import {useState, useEffect, useContext} from 'react';
import AuthApi from "./AuthApi";
import axios from 'axios';
import * as WorldWind from "@nasaworldwind/worldwind";

/**
 * TLE_LINE0: "0 YUNHAI 1-02 DEB"
 * @param {*} tle1  TLE_LINE1: "1 49267U 19063AT  21271.01286517  .00004529  00000-0  16332-2 0  9997"
 * @param {*} tle2  TLE_LINE2: "2 49267  98.5535 296.3547 0004348 107.3701 252.8041 14.34111012 27008"
 */

function invokeSatellite(tleLine1, tleLine2) {
  // Sample TLE
  //var tleLine1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992';
  //var tleLine2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';    

  var satrec = satellite.twoline2satrec(tleLine1, tleLine2);
  var positionAndVelocity = satellite.propagate(satrec, new Date());

  //console.log(positionAndVelocity);
  return positionAndVelocity;
}

function App() {
  const [auth, setAuth] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("component is mounted");
  }, []);

  return (
    <div className="App">
      <Home/>
    </div>
  );
}

//https://www.space-track.org/documentation#howto-api_intro
const Home = () => {

   // Create a WorldWindow for the canvas.
   var wwd = new WorldWind.WorldWindow("canvasOne");
  
   // Add some image layers to the WorldWindow's globe.
   wwd.addLayer(new WorldWind.BMNGOneImageLayer());
   wwd.addLayer(new WorldWind.BMNGLandsatLayer());

   // Add a compass, a coordinates display and some view controls to the WorldWindow.
   wwd.addLayer(new WorldWind.CompassLayer());
   wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
   wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

  const data = {
    "identity": "marcoasilvapt@gmail.com",
    "password": "Spacenuts2021!*",
    "query": "https://www.space-track.org/basicspacedata/query/class/gp/OBJECT_TYPE/debris"
  };

  const extra = {
    withCredentials: true,
    mode: 'no-cors',
    credentials: 'same-origin',
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
      'Access-Control-Allow-Origin': 'http://localhost:3000', 
      'Content-Type': 'application/json'
    }
  }

  const fetchSpaceTrackData = () => {
    //Auth.setAuth(true);
    axios.post("https://www.space-track.org/ajaxauth/login", data, extra).then(response => {
      if(response.status === 200){
        
        window.mydata = response.data;

        for (var i = 0; i < response.data.length; i++) {
          console.log();
          var coord = invokeSatellite(response.data[i].TLE_LINE1,response.data[i].TLE_LINE2);


          //debugger;
          // Add a placemark
          var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
          wwd.addLayer(placemarkLayer);

          var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    
          placemarkAttributes.imageOffset = new WorldWind.Offset(
              WorldWind.OFFSET_FRACTION, 0.3,
              WorldWind.OFFSET_FRACTION, 0.3);
    
          placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
          placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
              WorldWind.OFFSET_FRACTION, 0.5,
              WorldWind.OFFSET_FRACTION, 1.0);
    
    
          //placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";
          var position = new WorldWind.Position(coord.position.x, coord.position.y, coord.position.z);
          var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
          placemark.label = response.data[i].TLE_LINE0;
    
          // debugger;
          placemarkLayer.addRenderable(placemark);
        } 
      }
    }).catch(err => console.warn(err));
  }
  return (
    <div>
      <header className="App-header"> 
      {fetchSpaceTrackData()}
      </header>
    </div>
  )
}
export default App;
