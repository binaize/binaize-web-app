
import React from 'react';

import './App.css';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./component/Login";
import Experiments from "./component/Experiments";
import ConversionDashboard from "./component/ConversionDashboard";
import ABTestingDashboard from "./component/ABTestingDashboard";

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
                        <Route exact={true} path={"/ABTestingDashboard"} component={ABTestingDashboard}/>
                        <Route exact={true} path={"/conversionDashboard"} component={ConversionDashboard}/>

                    </Switch>
                </Router>
            </AppProvider>
        );
    }
}

export default App;
