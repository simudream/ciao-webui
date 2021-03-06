var React = require('react');
var ReactDOM = require('react-dom');
var loginComponent = require('../components/login');
var navbar = require('../components/navbar.js');
var Logger = require('../util/logger.js');
var Messages = require('../components/messages.js');

$('document').ready(function () {

    //Create logger instance
    var logger = new Logger('log-container');
    window.logger = logger;
    // create logger visual component
    ReactDOM.render(React.createElement(Messages, { data: [], logger: logger }), document.getElementById("logger"));

    var n = React.createElement(navbar, {});
    ReactDOM.render(n, document.getElementById("main-top-navbar"));

    var l = React.createElement(loginComponent, { logger: logger });
    ReactDOM.render(l, document.getElementById("login-container"));
});