'use strict';

const React = require('react');
const ReactRouter = require('react-router');

const browserHistory = ReactRouter.browserHistory;
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;

const App  = require('./components/app');
const NotFound  = require('./components/not-found');

module.exports = (
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="*" component={NotFound} />
    </Router>
);
