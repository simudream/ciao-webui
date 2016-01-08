var React = require('react');
var ReactDOM = require('react-dom');
var InstancesHost = require('../components/instancesHost.js');
var GroupOverview = require('../components/groupOverview.js');
var UsageSummary = require('../components/usageSummary.js');
var AddInstances = require('../components/addInstances.js');
var navbar = require('../components/navbar.js');
var $ = require('jquery');

$('document').ready(function () {

    //create usage summary
    // How to use Usage Summary
    // first use a data source compatible for componenet.

    var getUnitString = function (value) {

        if (value == null)
            return function (arg) {return arg;};

        return value < 1500 ?
            value + "GB" :
            (value / 1000) + "TB";
    };

    var activeTenant = datamanager.data.activeTenant;

    // Component to Add instances
    datamanager.onDataSourceSet('add-instances', function (sourceData) {
        ReactDOM.render(
        <AddInstances sourceData={sourceData}/>,
        document.getElementById("add-instances"));
    });

    //Usage summary
    datamanager.onDataSourceSet('usage-summary', function (sourceData) {
        sourceData.source = "/resources";
        ReactDOM.render(
            <UsageSummary {...sourceData}/>,
            document.getElementById("usage-summary"));
    });
    // react hierarchy would be re-rendered
    datamanager.setDataSource('usage-summary', {data:[]});

    //create instances host
    var keyInstanceHost = 'instances-host';
    datamanager.onDataSourceSet(keyInstanceHost, function (sourceData) {
        sourceData.source = "/data/"
            + datamanager.data.activeTenant.id
            + "/servers/detail";
        sourceData.dataKey = keyInstanceHost;
        ReactDOM.render(
            <InstancesHost {...sourceData}/>,
            document.getElementById('instances-host'));
    });

    datamanager.setDataSource('instances-host',{data:[]});

    // create group overview
    datamanager.onDataSourceSet('group-overview', function (sourceData) {
        ReactDOM.render(
                <GroupOverview {...sourceData}/>,
            document.getElementById("workloads-container"));
    });
    var getFlavors = function (attempts) {
        $.get({
            url:"/data/"+datamanager.data.activeTenant.id+"/flavors",
            timeout:5000})
            .done(function (data) {
                if (data) {
                    data.dataKey = 'group-overview';
                    data.detailUrl = '/data/' + datamanager.data.activeTenant.id;
                    datamanager.setDataSource('group-overview', data);
                    datamanager.setDataSource('add-instances', {activeTenant, data});
                }
            }.bind(this))
            .fail(function (err) {
                if (attempts< 3)
                    getFlavors(attempts +1);
                else {
                    var data = {};
                    data.dataKey = 'group-overview';
                    data.detailUrl = '/data/' + datamanager.data.activeTenant.id;
                    datamanager.setDataSource('group-overview', data);
                }
            });
    };
    getFlavors(0);

    // Navigation bar
    var nprops = { logoutUrl: "/authenticate/logout"};
    // Data manager gets tenants which was passed through  routes:/tenant
    nprops.tenants = datamanager.data.tenants;
    nprops.activeTenant = activeTenant;

    nprops.username = document
        .getElementById("main-top-navbar")
        .getAttribute("attr-user");
    var n = React.createElement(navbar, nprops);
    ReactDOM.render(n, document.getElementById("main-top-navbar"));
});
