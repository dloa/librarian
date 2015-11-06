import React from 'react/addons';
import Router from 'react-router';


import Framework from './components/Framework.react';
import Dashboard from './components/Dashboard.react';
import Preferences from './components/Preferences.react';
import PublishDashboard from './components/PublishDashboard.react';
import About from './components/About.react';
import IPFSManagement from './components/IPFSManagement.react';
import FloincoindManagement from './components/FloincoindManagement.react';


var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <RouteHandler/>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="framework" handler={Framework}>
      <Route name="dashboard" path="/dashboard" handler={Dashboard}/>
      <Route name="publish" path="/publish" handler={PublishDashboard}/>
      <Route name="preferences" path="/preferences" handler={Preferences}/>
      <Route name="about" path="/about" handler={About}/>
      <Route name="IPFSManagement" path="/management/ipfs" handler={IPFSManagement}/>
      <Route name="FloincoindManagement" path="/management/floincoind" handler={FloincoindManagement}/>
    </Route>
  </Route>
);

module.exports = routes;
