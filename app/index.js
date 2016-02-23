'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const routes = require('./routes');

const SearchForm = React.createClass({

    render () {

        return (<h1>Hello, World!</h1>)
    }
});

const NotFound = React.createClass({

    render () {

        return (<h1>Not Found!</h1>)
    }
});

ReactDOM.render(routes, document.querySelector('#app'));
