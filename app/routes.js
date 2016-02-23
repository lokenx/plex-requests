'use strict';

const ReactRouter = require('react-router');
const createBrowserHistory = require('history/lib/createBrowserHistory');

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const Navigation = ReactRouter.Navigation;

module.exports = (
    <Router history={createBrowserHistory()}>
        <Route path="/" component={SearchForm} />
        <Route path="*" component={NotFound} />
    </Router>
)
