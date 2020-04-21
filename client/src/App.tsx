import React from "react";
import { Switch, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Account from "./components/Account";
import Paymethod from "./components/Paymethod";
import Address from "./components/Address";
import Notification from "./components/Notification";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/account" component={Account} />
        <Route path="/paymethod" component={Paymethod} />
        <Route path="/address" component={Address} />
        <Route path="/notification" component={Notification} />
        <Route component={Address} />
      </Switch>
    </div>
  );
}

export default App;
