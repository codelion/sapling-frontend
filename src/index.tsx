/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore, { history } from 'store/configureStore';
import Root from './components/Root';
import './styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const store = configureStore();
const hotWindow = window;

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('app')
);

if (hotWindow.module && hotWindow.module.hot) {
  /**
   * This method enables hot module replacement in a webpack environment by accepting the new updated version of the 'Root' component.
   * It then renders the newly updated 'Root' component inside an 'AppContainer' and then finally mounts it to the DOM.
   * @param {string} './components/Root' - The specific dependency causing the update (i.e., the module's path).
   * @callback {Function}  - An update function, which allows re-rendering of the main Application interface with the updated 'Root' component.
   * There are no explicit returns in this function as it performs an action (updating and re-rendering a component) rather than computing a value.
   */
  
  hotWindow.module.hot.accept('./components/Root', () => {
    const NewRoot = require('./components/Root').default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
