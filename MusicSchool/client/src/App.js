import Nav, {  } from './Components/nav'
import { Routes, Route, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import useToken from './Components/useToken';
import Logout from './Pages/Logout';
import SlideDrawer, { Backdrop, DrawerItem, DrawerSection } from './Components/sideNav';

import homeImg from "./Assets/nav/house.png";
import userImg from "./Assets/nav/user.png";
import roomImg from "./Assets/nav/room.png";
import instrumentImg from "./Assets/nav/instrument.png";
import jobsImg from "./Assets/nav/jobs.png";
import requestImg from "./Assets/nav/request.png";
import unavailableImg from "./Assets/nav/unavailable.png";

import logoutImg from "./Assets/nav/logout.png";

import Users from './Pages/Users';
import Studios from './Pages/Studio';
import Instruments from './Pages/Instruments';

import StaffLanding from './Pages/staff/staff-landing';
import Availabilities from './Pages/staff/availabilities';

import JobRejectionRequest from './Pages/admin/JobRejectionRequests';
import Jobs from './Pages/admin/Jobs';

import ManagerLanding from './Pages/manager/manager-landing';
import JobAllocation from './Pages/manager/jobAllocation';

import Unavailabilities from './Pages/admin/unavailabilities';
/* function getToken() {  
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
} */

export default function App() {
  const { token, setToken, logout } = useToken();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [active, setActive] = React.useState("Dashboard")
  const [height, setHeight] = React.useState(window.innerHeight);


  const drawerToggleClickHandler = () => {
    setDrawerOpen(!drawerOpen)
  }

  useEffect(()=>{
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight);
    });
  })

  let backdrop;
  if (drawerOpen) {
    backdrop = <Backdrop toggle={drawerToggleClickHandler} />;
  }

  const navigate = useNavigate();
  if (!token) {
    return (
        <div className="App" style={{maxHeight: height}}>
          <LoggedOutNav toggle={drawerToggleClickHandler}></LoggedOutNav>
          <div className="App-header" style={{maxHeight: height - 56}}>
            <SlideDrawer show={drawerOpen} toggle={drawerToggleClickHandler} direction="top">
              <DrawerSection label={"Modules"}>
                <DrawerItem label="Dashboard" to={"/"} logo={homeImg}></DrawerItem>
              </DrawerSection>
            </SlideDrawer>
            {backdrop}
            <Routes>
              <Route path="/" element={
                <Login setToken={setToken}></Login>}></Route>
              <Route path="/Register" element={<Register />}></Route>
            </Routes>
          </div>
        </div>
    )
  } else {
    return (
        <div className="App" style={{maxHeight: height}}>
          <LoggedInNav user={token} logout={logout} toggle={drawerToggleClickHandler} show={drawerOpen}></LoggedInNav>
          <header className="App-header" style={{maxHeight: height - 56}}>
            {backdrop}
            <SlideDrawer show={drawerOpen} toggle={drawerToggleClickHandler} direction={"top"}>
              {token.data[0].role === "admin" && 
              <DrawerSection label={"Modules"}>
                <DrawerItem label="Users" to={"/"} logo={userImg} currentActive = {active} setActive={setActive}></DrawerItem>
                <DrawerItem label="Studio" to={"/Studio"} logo={roomImg} currentActive = {active} setActive={setActive}></DrawerItem>
                <DrawerItem label="Instruments" to={"/Instruments"} logo={instrumentImg} currentActive = {active} setActive={setActive}></DrawerItem>
                <DrawerItem label="Jobs" to={"/Jobs"} logo={jobsImg} currentActive = {active} setActive={setActive}></DrawerItem>
                <DrawerItem label="Requests" to={"/Requests"} logo={requestImg} currentActive = {active} setActive={setActive}></DrawerItem>
                <DrawerItem label="Unavailabilities" to={"/Unavailabilities"} logo={unavailableImg} currentActive = {active} setActive={setActive}></DrawerItem>
              </DrawerSection>
              }
              {token.data[0].role === "staff" &&
              <DrawerSection label={"Modules"}>
                <DrawerItem label="Home" to={"/"} logo={homeImg}></DrawerItem>
                <DrawerItem label="Availabilities" to={"/Availabilities"} logo={unavailableImg}></DrawerItem>
                <DrawerItem label="Logout" to={"/Logout"} logo={logoutImg}></DrawerItem>
              </DrawerSection>
              }
              {token.data[0].role === "manager" &&
              <DrawerSection label={"Modules"}>
                <DrawerItem label="Home" to={"/"} logo={homeImg}></DrawerItem>
                <DrawerItem label="Job Allocation" to={"/JobAllocation"} logo={jobsImg}></DrawerItem>
                <DrawerItem label="Logout" to={"/Logout"} logo={logoutImg}></DrawerItem>
              </DrawerSection>
              }
            </SlideDrawer>
            
            {token.data[0].role === "admin" &&
            <Routes>
              <Route path="/" element={<Users user={token}/>}/>
              <Route path="/Studio" element={<Studios user={token}/>}/>
              <Route path="/Instruments" element={<Instruments user={token}/>}/>

              <Route path="/Jobs" element={<Jobs user={token}/>}/>
              <Route path="/Requests" element={<JobRejectionRequest user={token}></JobRejectionRequest>}/>
              
              <Route path="/Unavailabilities" element={<Unavailabilities user={token}/>}/>

              <Route path="/Logout" element={<Logout logout={logout}></Logout>}/>
            </Routes>
            }
            {token.data[0].role === "staff" &&
            <Routes>
              <Route exact path="/" element={<StaffLanding  user={token}/>}>
              </Route>
              <Route path="/Availabilities" element={<Availabilities user={token}/>}>
              </Route>
              <Route path="/Logout" element={<Logout logout={logout}></Logout>}>
              </Route>
            </Routes>
            }
            {token.data[0].role === "manager" &&
            <Routes>
              <Route exact path="/" element={<ManagerLanding  user={token}/>}>
              </Route>
              <Route exact path="/JobAllocation"  element={<JobAllocation user={token}/>}>  
              </Route>
              <Route path="/Logout" element={<Logout logout={logout}></Logout>}>
              </Route>
            </Routes>
            }
          </header>
        </div>
    );
  }
}


class LoggedInNav extends React.Component {

  state = {
    title: "MUSE"
  }
  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    const md = 768;
   if(window.innerWidth >= md){
        this.setState({
          title: "MUSE"
        })
    } else{
        this.setState({
          title: "MUSE"
        })
    }
  }
  render() {

    return (
      <Nav user={this.props.user} title={this.state.title
      } toggle={this.props.toggle} show={this.props.show}>
      </Nav>
    )
  }
}

class LoggedOutNav extends React.Component {
  render() {
    return (
      <Nav title={
        "MUSE"
      } toggle={this.props.toggle} >
      </Nav>
    )
  }
}