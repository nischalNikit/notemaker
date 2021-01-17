import React from 'react';
import classes from './Layout.css';

import Sidebar from '../components/Sidebar/Sidebar';

const Layout = (props) => {
    return(
        <div className = {classes.Layout}>
            <Sidebar />
            {props.children}
        </div>
    )
}

export default Layout;