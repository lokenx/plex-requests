'use strict';

const React = require('react');

const SearchForm = React.createClass({

    propTypes: {
        search: React.PropTypes.func
    },

    handleChange() {

        const query = {
            type: 'movie',
            value: this.refs.searchQuery.value
        };

        if (query.value.length > 1) {
            this.props.search(query);
        }

    },

    render() {

        return (
            <form id="search-form">
				<input type="text" id="search-input" placeholder="Search" ref="searchQuery" onChange={this.handleChange} autoFocus />
			</form>
        );
    }
});

module.exports = SearchForm;
