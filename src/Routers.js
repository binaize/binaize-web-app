import React from "react";
import { Route, Switch} from "react-router-dom";
import UserData from "./component/UserData";
// import {Route} from "react-router";

export const Routes = (
    <Switch>
        <Route path="/" component={UserData} />
    </Switch>
);