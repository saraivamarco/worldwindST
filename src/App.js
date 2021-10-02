import './App.css';
import * as satellite from "satellite.js";
import {useState, useEffect} from 'react';
import * as WorldWind from "@nasaworldwind/worldwind";
import { fetchLiveData, fetchDummyData } from './Client';

/**
 * TLE_LINE0: "0 YUNHAI 1-02 DEB"
 * @param {*} tle1  TLE_LINE1: "1 49267U 19063AT  21271.01286517  .00004529  00000-0  16332-2 0  9997"
 * @param {*} tle2  TLE_LINE2: "2 49267  98.5535 296.3547 0004348 107.3701 252.8041 14.34111012 27008"
 */

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {

    // Create a WorldWindow for the canvas.
    var wwd = new WorldWind.WorldWindow("canvasOne");
    
    // Add some image layers to the WorldWindow's globe.
    wwd.addLayer(new WorldWind.BMNGOneImageLayer());
    wwd.addLayer(new WorldWind.BMNGLandsatLayer());

    // Add a compass, a coordinates display and some view controls to the WorldWindow.
    wwd.addLayer(new WorldWind.CompassLayer());
    wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
    wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));


    // Add a placemark
    var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
    wwd.addLayer(placemarkLayer);
    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
    
    placemarkAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.3,
        WorldWind.OFFSET_FRACTION, 0.3);

    placemarkAttributes.imageScale = 0.08;
    placemarkAttributes.imageColor = WorldWind.Color.YELLOW;

    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1.0);
    placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

    var data = [];
    //const interval = setInterval(() => {
      //console.log('This will run every 1 seconds!');

      if( typeof(window.data) !== 'undefined' ) {

        for (var i = 0; i < window.data.length; i++) {
          /*
          for(var j=0; j < data.length; j++){
            if(data[j].userProperties.id === window.stdata[i].OBJECT_ID){
              coord = invokeSatellite(window.stdata[i].TLE_LINE1, window.stdata[i].TLE_LINE2);
              if( typeof(coord.position) !== 'undefined' ) {
                data[j].position.latitude = coord.position.x;
                data[j].position.longitude = coord.position.y;
                data[j].position.altitude = coord.position.z;
              }
              return;
            }
          }
          */
         // var coord = invokeSatellite(window.stdata[i].TLE_LINE1,window.stdata[i].TLE_LINE2);

         
         if(typeof window.data[i].TLE_LINE1 !== 'undefined') {
           console.log("still moving...")
           console.log(window.data[i].TLE_LINE1);
           console.log(window.data[i].TLE_LINE2);
           
            var satrec = satellite.twoline2satrec(window.data[i].TLE_LINE1, window.data[i].TLE_LINE2);
            var coord = satellite.propagate(satrec, new Date());
            
            
            if( typeof(coord.position) !== 'undefined' ) {
              var position = new WorldWind.Position(coord.position.x, coord.position.y, coord.position.z);
              
              var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
              placemark.label = window.data[i].TLE_LINE0;
              placemark.altitudeMode = WorldWind.RELATIVE_TO_GLOBE;

              //OBJECT_ID
              placemark.userProperties.id=window.data[i].OBJECT_ID;
        
             
              placemarkLayer.addRenderable(placemark);

              console.log("dummy data");
              //console.log(data);

              //data.push(placemark);
            }
          }
        }
      }

    //}, 1000);
    //return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {fetchDummyData()}
    </div>
  );

}
export default App;
