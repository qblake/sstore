/** @jsx React.DOM */

var React = require('react');
var App = require('./components/App.jsx');

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

React.render(
  <App />,
  document.getElementById('content')
);
