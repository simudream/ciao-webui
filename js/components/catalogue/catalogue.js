// React js component
var React = require('react');
var CustomCatalogue = require('./customCatalogue.js');
var $ = require('jquery');

var catalogue = React.createClass({
    displayName: 'catalogue',

    getInitialState: function () {//all this fields are necessary?
        return {
            pagination: 0, // offset is 0,
            items: 0,
            refresh: 3500,
            status: null, // selected status
            updating: false
        };
    },

    getDefaultProps: function () {//all this fields are necessary?
        // source defaults to server details url
        return {
            data: [],
            count : 0,
            recordsPerPage:10
        };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if(nextState.updating != this.state.updating)
            return false;
        return true;
    },

    componentDidMount: function () {

        var callSource = function () {
            if (this.state.updating == true)
                return;
            this.setState({updating: true});
            var query = '?limit=' + this.props.recordsPerPage;
            query = query +
                '&offset=' + (datamanager.data.offset ?
                    ((datamanager.data.offset -1)
                    * this.props.recordsPerPage):0);
            var url = this.props.source + query;

            $.get({url: url })
                .done(function (data) {
                    if (data) {

                        var url = this.props.source + '/count';
                        $.get({url: url })
                            .done(function (count) {

                                var frmData = {
                                    dataKey: this.props.dataKey,
                                    source: this.props.source,
                                    refresh: this.props.refresh,
                                    recordsPerPage: this.props.recordsPerPage,
                                    buttonsActions: this.props.buttonsActions,
                                    data: data,
                                    count: count,
                                    selectActions: this.props.selectActions,
                                    search:this.props.search,
                                    id:this.props.id
                                };

                                this.setState({updating: false});
                                datamanager.setDataSource(this.props.dataKey,
                                    frmData);
                            }.bind(this));
                    }
                }.bind(this))
                .fail(function (err) {
                    this.setState({updating: false});
                    datamanager.setDataSource(this.props.dataKey, {
                        dataKey: this.props.dataKey,
                        source: this.props.source });
                }.bind(this));
        }.bind(this);
        callSource();

        window.setInterval(function () {
            callSource();
        }.bind(this), this.props.refresh);
    },

    onChangePage: function (lastRecord) {
        this.setState({ pagination: lastRecord });
    },

    render: function () {

        var columns = [];
        if (this.props.data.length > 0) {
            columns = Object.keys(this.props.data[0]).map(function (text) {
                return text.replace('_', ' ');
            });
        }
        if (this.props.data) return React.createElement(CustomCatalogue, {
            data: this.props.data,
            count: this.props.count,
            columns: columns,
            buttonsActions: this.props.buttonsActions,
            dropDownActions: this.props.selectActions,
            searchFields: this.props.search.searchFields,
            searchTitle: this.props.search.title,
            onChangePage: this.onChangePage,
            id:this.props.id,
            ref: 'catalogue',

        });else return React.createElement('div', null);
    }
});

module.exports = catalogue;
