'use strict';

const React = require('react');
const SearchForm  = require('./search-form');

const App = React.createClass({

    getInitialState()  {

        return {
            searchQuery : '',
            searchType : 'movies',
            searchResults: {}
        };
    },

    search(query) {

        this.setState({
            searchType: query.type,
            searchQuery: query.value
        });

        console.log(this.state);
    },

    render() {

        return (
            <div className="plex-requests-app">
                <div className="plex-search-form">
                    <SearchForm search={this.search}/>
                </div>
            </div>
        );
    }
});

module.exports = App;
