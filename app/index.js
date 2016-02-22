'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const Hello = React.createClass({

    render() {

        return (
            <h1>Hello World</h1>
        );
    }
});

console.log('REACT!');

ReactDOM.render(
    <Hello />,
    document.getElementById('app')
);
