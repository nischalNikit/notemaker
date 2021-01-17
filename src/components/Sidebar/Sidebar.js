import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import classes from './Sidebar.css';

import * as actions from '../../store/action';

const Sidebar = (props) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(store => store.userId)

    return(
        <div className = {classes.Sidebar}>
            <span className = {classes.Headline}>notemaker</span>
            <div className = {classes.Navigation}>
                <NavLink 
                    to = "/home"
                    activeClassName = {classes.ActiveNavButton}
                    className = {classes.NavButton}
                >
                    HOME
                </NavLink>
                {
                    !isAuthenticated &&                 
                    <NavLink 
                        to = "/auth"
                        activeClassName = {classes.ActiveNavButton}
                        className = {classes.NavButton}
                    >
                        LOGIN/SIGN UP
                    </NavLink>
                }
            </div>
            {   isAuthenticated &&  
                <button
                    className = {classes.InputButton}
                    onClick = {() => dispatch(actions.authLogout())}
                >logout</button>
            }
        </div>
    )
}

export default Sidebar;