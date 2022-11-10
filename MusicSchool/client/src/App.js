import './App.css';
import Nav, {  } from './Components/nav'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Home from './Pages/Home';
import DefaultPage from './Pages/DefaultPage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import useToken from './Components/useToken';
import Logout from './Pages/Logout';
import SlideDrawer, { Backdrop, DrawerItem, DrawerSection } from './Components/sideNav';

import dashboard from "./Assets/nav/dashboard.png";

import Users from './Pages/Users';
import Studios from './Pages/Studio';
import Instruments from './Pages/Instruments';

import ManagerLanding from './Pages/manager/manager-landing';
import JobAllocation from './Pages/manager/jobAllocation';

import StaffLanding from './Pages/staff/staff-landing';
import Availabilities from './Pages/staff/availabilities';

/* function getToken() {  
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
} */

export default function App() {
  const { token, setToken, logout } = useToken();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const drawerToggleClickHandler = () => {
    setDrawerOpen(!drawerOpen)
  }


  let backdrop;
  if (drawerOpen) {
    backdrop = <Backdrop toggle={drawerToggleClickHandler} />;
  }

  if (!token) {
    return (
      <Router>
        {/* {backdrop} */}
        <div className="App">
          <LoggedOutNav toggle={drawerToggleClickHandler}></LoggedOutNav>
          <div className="App-header">
            <SlideDrawer show={drawerOpen} toggle={drawerToggleClickHandler} direction="top">
              <DrawerSection label={"Modules"}>
                <DrawerItem label="Dashboard" to={"/"} logo={dashboard}></DrawerItem>
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
      </Router>
    )
  } else {
    return (
      <Router>
        {/* {backdrop} */}
        <div className="App">
          <LoggedInNav user={token} logout={logout} toggle={drawerToggleClickHandler} show={drawerOpen}></LoggedInNav>
          <header className="App-header">
            {backdrop}
            <SlideDrawer show={drawerOpen} toggle={drawerToggleClickHandler} direction={"top"}>
              {token.data[0].role === "admin" && 
              <DrawerSection label={"Modules"}>
                <DrawerItem label="Dashboard" to={"/"} logo={dashboard}></DrawerItem>
                <DrawerItem label="Users" to={"/Users"} logo={dashboard}></DrawerItem>
                <DrawerItem label="Studios" to={"/Studios"} logo={dashboard}></DrawerItem>
                <DrawerItem label="Instruments" to={"/Instruments"} logo={dashboard}></DrawerItem>
              </DrawerSection>
              }
              {token.data[0].role === "staff" &&
              <DrawerSection label={"Modules"}>
                <DrawerItem label="Home" to={"/"} logo={dashboard}></DrawerItem>
                <DrawerItem label="Availabilities" to={"/Availabilities"} logo={dashboard}></DrawerItem>
              </DrawerSection>
              }
              {token.data[0].role === "manager" &&
              <DrawerSection label={"Modules"}>
                <DrawerItem label="Home" to={"/"} logo={dashboard}></DrawerItem>
                <DrawerItem label="Job Allocation" to={"/job-allocation"} logo={dashboard}></DrawerItem>
              </DrawerSection>
              }
            </SlideDrawer>
            {token.data[0].role === "admin" &&
            <Routes>
              <Route exact path="/" element={<DefaultPage />}>
              </Route>
              <Route path="/Home" element={<Home />}>
              </Route>
              <Route path="/Users" element={<Users user={token}/>}>
              </Route>
              <Route path="/Studios" element={<Studios user={token}/>}>
              </Route>
              <Route path="/Instruments" element={<Instruments user= {token}/>}>
              </Route>
              <Route path="/Logout" element={<Logout logout={logout}></Logout>}></Route>
            </Routes>
            }
            {token.data[0].role === "staff" &&
            <Routes>
              <Route exact path="/" element={<StaffLanding  user={token}/>}>
              </Route>
              <Route exact path="/Availabilities" element={<Availabilities  user={token}/>}>
              </Route>
              <Route path="/Logout" element={<Logout logout={logout}></Logout>}>
              </Route>
            </Routes>
            }
            {token.data[0].role === "manager" &&
            
            <Routes>
            <Route exact path="/" element={<ManagerLanding  user={token}/>}>
            </Route>
            <Route exact path="/job-allocation" element = {<JobAllocation user={token}></JobAllocation>}>
            </Route>
            <Route path="/Logout" element={<Logout logout={logout}></Logout>}></Route>
            </Routes>
            }
          </header>
        </div>
      </Router>
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