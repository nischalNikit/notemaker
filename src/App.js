import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import Layout from './container/Layout';

import * as actions from './store/action';
import Home from './screens/Home';
import Auth from './screens/Auth';

const App = (props) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.checkAuthState());
  }, []);

  return (
    <Layout>
      <Switch>
        <Route path = "/home" component = {Home} />
        <Route path = "/auth"   component = {Auth} />
        <Route path = "/" exact>
          <Redirect to = "/home" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
