import React, {useEffect} from 'react'
import { Route, Switch, Link, useRouteMatch, useLocation, useHistory} from "react-router-dom";
import Dashboard from './Dashboard';
import Message from './Message';
import Report from './Report';
import Review from './Review';
import SnackbarProvider from 'react-simple-snackbar'


import { MdDashboard } from 'react-icons/md';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import { RiErrorWarningFill, RiLogoutBoxFill } from 'react-icons/ri';
import { FaStarHalfAlt } from 'react-icons/fa';
import dashL from '../assets/dashboardL.png'


function Main () {
    let { path, url } = useRouteMatch();
    const location = useLocation()
    let history = useHistory();

    // Initial highlight button
    useEffect(() => {
        const tabList = document.querySelectorAll(".sideNav a")
        for (const t of tabList) {
            // Reset all tabs
            t.style.borderRight =
                (t.id === location.pathname ? "5px solid #FF6B37" : null)
            t.style.color =
                 (t.id === location.pathname ? "#FF6B37" : "black")
        }
    }, [location]);

    return (
        <SnackbarProvider>
        <div className="main">
            <div className="sideNav">
                <div style={{display:'flex', flexDirection:'column'}}>
                <img src={dashL} style={{width:'9vw', paddingLeft:'1vw', objectFit:'contain',marginBottom:50, marginTop:20, alignSelf:'flex-start'}}/>

                <Link to={`${url}`} id={`${url}`} className="sideNav-tab">
                    <MdDashboard style={{width:20, height:20, marginRight:10}}/> 
                    Dashboard
                </Link>
                <Link to={`${url}/message`} id={`${url}/message`} className="sideNav-tab">
                    <IoChatboxEllipsesSharp style={{width:20, height:20, marginRight:10}}/> 
                    Messages
                </Link>
                <Link to={`${url}/report`} id={`${url}/report`} className="sideNav-tab">
                    <RiErrorWarningFill style={{width:20, height:20, marginRight:10}}/> 
                   <span style={{textAlign:'left'}}>Faulty Reports</span> 
                </Link>
                <Link to={`${url}/review`} id={`${url}/review`} className="sideNav-tab">
                    <FaStarHalfAlt style={{width:20, height:20, marginRight:10}}/> 
                    Reviews
                </Link>
                </div>

                <div onClick={()=>{history.replace('/')}} className="sideNav-tab">
                    <RiLogoutBoxFill style={{width:20, height:20, marginRight:10}}/>
                    Log out
                </div>
            </div>
            <div className="main-right">
            <Switch>
                <Route exact path={path} component ={Dashboard}/>
                <Route path={`${path}/message`} component ={Message}/>
                <Route path={`${path}/report`} component ={Report}/>
                <Route path={`${path}/review`} component ={Review}/>
            </Switch>
            
            </div>
        </div>
    </SnackbarProvider>
    )
}

export default Main;