// React js component
var React = require('react');
var CustomCatalogue = require('./catalogue/customCatalogue.js');

var nodes = React.createClass({
    getInitialState: function() {
        return {
            offset: 0,
            limit: 10,
            updating: false
        };
    },

    //not available at the moment
    evacuateNode: function() {
    },

    disabledEvacuate: function(){
        return true;
    },

    onChangePage: function (lastRecord) {//?
        this.setState({ pagination: lastRecord });
    },
    getActions: function(){
        return [
            {
                label:'Evacuate',
                name:'evacuate',
                onClick:this.evacuateNode,
                onDisabled:this.disabledEvacuate
            }
        ];
    },

    getDropdownActions: function(){
        return [
            {
                label:'All',
                name:'all',
                query: {'status':'all'}
            },{
                label:'All Ready',
                name:'ready',
                query: {'status':'READY'}
            },
            {
                label:'All Maintenance',
                name:'maintenance',
                query:{'status':'MAINTENANCE'}
            },
            {
                label:'All Full',
                name:'full',
                query:{'status':'FULL'}
            },
            {
                label:'All Offline',
                name:'offline',
                query:{'status':'OFFLINE'}
            },
            {
                label:'None',
                name:'none',
                query: {'status':'none'}
            }
        ];
    },

    getSearchfields: function(){
        return  ['status', 'utilization', 'geography'];
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if(nextState.updating != this.state.updating)
            return false;
        return true;
    },

    componentDidMount: function() {
        var update = function () {
            if(this.state.updating == true)
                return;
            this.setState({updating:true});
            var query = "?limit=" + this.state.limit
                + "&offset=" + (this.state.offset * this.state.limit);
            $.get({url: this.props.source + "/count"})
                .done(function (count) {

                    $.get({
                        url: this.props.source + query})
                        .done(function (data) {
                            if (data) {
                                var fmtData = data.nodes.map((node) => {
                                    delete node.updated;
                                    return node;
                                });
                                this.setState({updating:false});
                                datamanager.setDataSource('nodes', {
                                    source: this.props.source,
                                    count: count.count,
                                    data: fmtData});
                            }
                        }.bind(this));
                }.bind(this));

        }.bind(this); //end update function

        update();
        window.setInterval(update, 2000);
    },

    render: function() {
        var columns = [];
        if (this.props.data.length > 0) {
            columns = Object.keys(this.props.data[0]).map(function(text){
                return text.replace(/_/g, " ");
            });
        }

        var link = {
            field:'id',
            url:'/admin/machine/'
        };

        if (this.props.data) return React.createElement(CustomCatalogue, {
            data: this.props.data,
            count: this.props.count,
            limit: this.state.limit,
            link: link,
            columns: columns,
            actions: this.getActions(),
            dropDownActions: this.getDropdownActions(),
            searchFields: this.getSearchfields(),
            onChangePage: this.onChangePage,
           // selectAll: this.selectAll,
            id:'id',
            ref: 'catalogue',
            searchTitle: "Search Nodes"
        });else return React.createElement('div', null);
    }
});

module.exports = nodes;
