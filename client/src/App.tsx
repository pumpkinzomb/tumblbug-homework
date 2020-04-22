import React from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import Profile from "./components/Profile";
import Account from "./components/Account";
import Paymethod from "./components/Paymethod";
import Address from "./components/Address";
import Notification from "./components/Notification";
import "./styles/App.scss";

function App() {
  return (
    <section className="App">
      <h1>설정</h1>
      <div className="setting-nav">
        <ul>
          <li>
            <NavLink activeClassName="on" to="/profile">
              프로필
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="on" to="/account">
              계정
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="on" to="/paymethod">
              결제수단
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="on" to="/address">
              배송지
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="on" to="/notification">
              알림
            </NavLink>
          </li>
        </ul>
      </div>
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/account" component={Account} />
        <Route path="/paymethod" component={Paymethod} />
        <Route path="/address" component={Address} />
        <Route path="/notification" component={Notification} />
        <Route component={Address} />
      </Switch>
    </section>
  );
}

export default App;
