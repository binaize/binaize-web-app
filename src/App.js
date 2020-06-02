
import React from 'react';

import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./component/Login";

import Dashboard from "./component/Dashboard"
import Experiments from "./component/Experiments";

import './App.css';
import DashboardAnother from "./component/Dashboard_another";

class App extends React.Component {
    render() {
        return (
            <AppProvider i18n={enTranslations}>
                <Router>
                    <Switch>
                        <Route exact={true} path={"/"} render={() => (
                            <Login/>
                        )}/>
                        {/*<Route exact={true} path={"/expi"} component={ResponsiveDrawer}/>*/}

                        <Route exact={true} path={"/experiment"} component={Experiments}/>
                        <Route exact={true} path={"/ABTestingDashboard"} component={Dashboard}/>
                        <Route exact={true} path={"/conversionDashboard"} component={DashboardAnother}/>

                    </Switch>
                </Router>
            </AppProvider>
        );
    }
}

export default App;
