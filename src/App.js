
import React from 'react';
import '@shopify/polaris/styles.css';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./component/Login";
import Experiments from "./component/Experiments"
import Dashboard from "./component/Dashboard"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            access_token: ''
        };
    }

    render() {
        return (
            <AppProvider i18n={enTranslations}>
                <Router>
                    <Switch>
                        <Route exact={true} path={"/"} render={() => (
                            <Login/>
                        )}/>
                        <Route exact={true} path={"/exp"} component={Experiments}/>

                        <Route exact={true} path={"/dashboard"} component={Dashboard}/>

                    </Switch>
                </Router>
            </AppProvider>
        );
    }
}

export default App;
