// usage Summary display current instances,memory,vCPUs and disk vs quota
var React = require('react');
var ReactDOM = require('react-dom/server');
var ElementSummary = require('./elementSummary.js');

var usageSummary = React.createClass({

    getDefaultProps: function() {
        // source defaults to server details url
        return {
            data: {}
        };
    },
    componentDidMount: function() {
        var callSource = function () {
            var url;
            var instancesValue = 0, instancesQuota=0,
            memoryValue = 0, memoryQuota=0, procesorValue=0;

            if (!datamanager.data.activeTenant){
                url = "/data"+this.props.source;
            } else {
                url = "/data/"+datamanager.data.activeTenant.id+this.props.source;
            }
            $.get({
                url:url})
                .done(function (data) {
                    if (data) {
                        if (!datamanager.data.activeTenant){
                            data.nodes.map((node) => {
                                instancesValue+= node.total_running_instances;
                                instancesQuota+= node.total_instances;
                                memoryValue+= node.ram_total-node.ram_available;
                                memoryQuota+=node.ram_total;
                                procesorValue+= node.online_cpus;
                            });
                            var data = [
                                {
                                    value: instancesValue,
                                    quota: instancesQuota,
                                    name: "Running Instances",
                                    unit: ""
                                },
                                {
                                    value: memoryValue,
                                    quota: memoryQuota,
                                    name: "Memory Usage",
                                    unit: ""
                                },
                                {
                                    value: procesorValue,
                                    name: "Online Processor",
                                    unit: ""
                                }
                            ];
                        }
                        datamanager.setDataSource('usage-summary',{
                            source: this.props.source,
                            data:data
                        });
                        console.log(data);
                    }
                }.bind(this))
                .fail(function (err) {
                    datamanager.setDataSource('usage-summary',{
                        source: this.props.source});
                }.bind(this));
        }.bind(this);
        callSource();

        window.setInterval(function () {
            callSource();
        }.bind(this),2000);
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        //return this.props !== nextProps;
        return true;
    },
    render: function() {
        var dynamicWidth = Math.round(12 / this.props.data.length);
        var elements = [];

        if (this.props.data) this.props.data.forEach(
            (props) => {
                elements.push(
                    <div key={props.name} className={"col-xs-3 col-sm-3"}>
                        <ElementSummary {...props}/>
                    </div>);
                }
        );

        return (
            <div className="row">
                {elements}
            </div>);
    }

});

module.exports = usageSummary;
