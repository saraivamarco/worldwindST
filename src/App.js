import logo from './400x230-splash-nww.png';
import './App.css';
import * as satellite from "satellite.js";
import {getAllItems} from './Client';
import {useState, useEffect, useContext} from 'react';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom";
import AuthApi from "./AuthApi";
//import Cookies from 'js-cookie';
import axios from 'axios';

function invokeSatellite() {
  // Sample TLE
  var tleLine1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992';
  var tleLine2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';    

  var satrec = satellite.twoline2satrec(tleLine1, tleLine2);
  var positionAndVelocity = satellite.propagate(satrec, new Date());

  console.log(positionAndVelocity);
}

function App() {
  const [auth, setAuth] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("component is mounted");
    //readCookie();
    fetchData();
  }, []);

  /** consuming a dummy rest service - just for testing purposes */
  const fetchData = () =>
        getAllItems()
            .then(res => res.json())
            .then(data => {
                //console.log(data.data);
                setData(data.data);
        }).catch(err => {
                console.log(err.response)
                err.response.json().then(res => {
                    console.log(res);
                });
        }).finally(() => {
          setFetching(false);
        });

  function renderData() {
    const list = data.map(obj => <dt key={obj.id}>{obj.name}</dt>)
    return (
      <dl>{list}</dl>
    )
  }
  /** end of consuming a dummy rest service */

  /** It was planned to be used for getting the cookie from Space-Track but the feature is buggy
  const readCookie = () => {
    const user = Cookies.get("spacetrack_csrf_cookie");
    if(user){
      setAuth(true);
    }
  }
   */
 
  return (
    <div className="App">

      <AuthApi.Provider value={{auth,setAuth}}>
        <Router>
          <Routes></Routes>
        </Router>
      </AuthApi.Provider>
      
    </div>
  );
}

//https://www.space-track.org/documentation#howto-api_intro
const Home = () => {
  const Auth = useContext(AuthApi);

  const data = 
  {
    "identity": "<user_name>",
    "password": "<password>",
    "query": "https://www.space-track.org/basicspacedata/query/class/gp/OBJECT_TYPE/debris/limit/3"
  };

  const extra = 
  {
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


  const handleOnClick = () => {
    invokeSatellite();
    Auth.setAuth(true);
    //Cookies.set("spacetrack_csrf_cookie","578142329a6bcf8024271040928aeb0c");

    //let cookie = Cookies.get("chocolatechip");
    //if(cookie === undefined){
    axios.post("https://www.space-track.org/ajaxauth/login", data, extra).then(response => {
      if(response.status === 200){
        //debugger;
        console.log(response);
        //Cookies.set("chocolatechip", response.data);
      }
    }).catch(err => console.warn(err));
    //}
  }
  return (
    <div>
      <header className="App-header">
        <h1>Welcome</h1>
        <a href="https://worldwind.arc.nasa.gov">
        <img src={logo} className="App-logo" alt="logo" /></a>
        <p></p>
        <Button onClick={handleOnClick}>Query Space-Track.org for Debris</Button>
      </header>
    </div>
  )
}

const Dashboard = () => {
  const Auth = useContext(AuthApi);
  const handleOnClick = () => {
    Auth.setAuth(false);
    //Cookies.remove("spacetrack_csrf_cookie");
  }
  return (
    <div>
        <h1>Dashboard</h1>
        <Button onClick={handleOnClick}>Go Back</Button>
        <div id="table-wrapper">
          <div id="table-scroll">
            <table>
                <tbody>
                  <tr>
                    <td>
                    {/*renderData()*/}
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

const Routes = () => {
  const Auth = useContext(AuthApi);
  return (
    <Switch>
      <ProtectedLogin path="/home" auth={Auth.auth} component={Home}/>
      <ProtectedRoute path="/dashboard" auth={Auth.auth} component={Dashboard}/>
    </Switch>
  )
}

const ProtectedRoute = ({auth, component:Component, ...rest}) => {
  return (
    <Route
      {...rest}
      render = {()=> auth? 
        (<Component/>):
        (<Redirect to="/home"/>)
      }
    />
  )
}

const ProtectedLogin = ({auth, component:Component, ...rest}) => {
  return (
    <Route
      {...rest}
      render = {()=> !auth? 
        (<Component/>):
        (<Redirect to="/dashboard"/>)
      }
    />
  )
}

export default App;
