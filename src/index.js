import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Error from "./views/Error.js";
import AuthLayout from "layouts/Auth/Auth.js";
import AdminLayout from "layouts/Admin/Admin.js";

import "assets/scss/black-dashboard-react.scss"; 
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Redirect from="/" to="/auth/home" />
      <Route component={Error} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
