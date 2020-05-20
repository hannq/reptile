/// <reference path="../global.d.ts"/>

import React from 'react';
import ReactDOM from 'react-dom';
import Index from './views/setuo-loading';
import './index.less';

ReactDOM.render(<Index />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept('./views/setuo-loading', () => {
    const Index = require('./views/setuo-loading').default;
    ReactDOM.render(<Index />, document.getElementById('app'));
  })
}
