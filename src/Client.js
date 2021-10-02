import fetch from 'unfetch';
import axios from 'axios';
import {dummyData} from "./DummyData.js";

/**
 * SAMPLE REST SERVICE CONSUMER
 * @param {*} response 
 * @returns 
 */

const checkStatus = response => {
    if (response.ok) {
        return response;
    }
    // convert non-2xx HTTP responses into errors:
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

// Dummmy data
export const getAllItems = () =>
    fetch("https://gorest.co.in/public/v1/users")
        .then(checkStatus);

//------
  //https://www.space-track.org/documentation#howto-api_intro
export const fetchLiveData = ({data, setData}) => {
    const stdata = {
      "identity": "marcoasilvapt@gmail.com",
      "password": "Spacedebris2021",
      "query": "https://www.space-track.org/basicspacedata/query/class/gp/OBJECT_TYPE/debris/limit/10"
    }; //https://www.space-track.org/basicspacedata/query/class/gp/OBJECT_TYPE/DEBRIS
  
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
  
    axios.post("https://www.space-track.org/ajaxauth/login", stdata, extra).then(response => {
      if(response.status === 200){
        window.data = response.stdata;
        setData(response.stdata);
  
        console.log(data);
      }
    }).catch(err => console.warn(err));
  }


  /**
   * Dummmy data
   */
  export const fetchDummyData = () => {
    window.data = dummyData;
  } 