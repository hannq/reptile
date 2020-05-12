/// <reference path="../global.d.ts"/>

import React from 'react';
import ReactDOM from 'react-dom';
import Index from './views/index';

ReactDOM.render(<Index />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./views/index', () => {
    const Index = require('./views/index').default;
    ReactDOM.render(<Index />, document.getElementById('app'));
  })
}
