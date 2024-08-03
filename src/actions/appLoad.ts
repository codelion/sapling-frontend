import { Action, ActionCreatorsMapObject } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import IStoreState from 'store/IStoreState';
import { updateMe, fetchMe } from 'actions/myActions';

/**
 * This method checks the user's status by performing a fetch of the user profile to determine if the user is logged in.
 * If the fetched user has an Id (is logged in), the user state gets updated.
 * If a logged-in user tries to access /login, they get redirected to /boards. 
 * If a user is not logged in, they get directed to the /login page.
 * If the fetch operation fails, and the current path is part of public paths, the user stays in the current path, else redirected to /login.
 * 
 * @param {object}  history - The history object allows you to manage and interact with the browser history programmatically.
 * @returns {function} A Thunk function that returns a Promise. The Promise will get resolved when the fetchMe() API call. made inside the Thunk function finishes.
 */

export function checkUserStatus(history) {
  /**
   * This method is a Redux Thunk that fetches the user profile to check if the user is logged in.
   * If the user is logged in, it will redirect to /boards if the user is trying to access /login,
   * otherwise it will keep the user in the current location. If the user is not logged in,
   * it will attempt to navigate to the login page.
   * 
   * This method uses dispatch to interact with the Redux store.
   * The location object is destructured from the history object provided by React Router.
   * The pathname and search properties are destructured from the location object.
   * The hash is derived from the window object, if available.
   * The publicPathnames constant is an array of public paths that require no authentication.
   * 
   * @param {ThunkDispatch<IStoreState, void, Action>}  dispatch - A function that allows you to 
   * send (or 'dispatch') actions to change the state of the Redux store.
   * @returns {undefined} Does not have a return value.
   */
  return async (dispatch: ThunkDispatch<IStoreState, void, Action>) => {
    const { location } = history;
    const { pathname, search } = location;
    const hash = window && window.location && window.location.hash;
    const publicPathnames = ['/login', '/signup'];

    // Perform a fetch of user profile to check if logged in
    dispatch(fetchMe())
      /**
       * Checks if a user is logged in and updates their status accordingly. 
         Performs redirection based on the user's current url and login status. 
         If the user is logged in but on the '/login' path, it redirects to '/boards'.
         If the user is logged out, it redirects to '/login'.
       * @param {Object} res - Response object from an HTTP request.
       * @property {Object} data - Contains user data including id, if logged in.
       * @param {string} pathname - Current url path.
       * @param {string} search - Query parameters attached at the end of the current url.
       * @returns {void} No return value.
       */
      .then(res => {
        const { data } = res;
        const { id } = data;
        const isLoggedIn = !!id;

        // If you have researcher role you are logged in
        if (isLoggedIn) {
          dispatch(updateMe(data));

          // If a logged-in user is trying to access /login, redirect to /boards
          if (pathname.indexOf('/login') !== -1) {
            history.replace(`/boards`);
          } else {
            history.replace(`${pathname}${search}`);
          }
        } else {
          history.push('/login');
        }
      })
      /**
       * Error handling method for handling re-directions based on the requested pathname.
       * If the requested pathname is public, the user is redirected to thatpathname,
       * else, the user is redirected to the login page.
       * Intended for use within Promise chains.
       * @param {String}  pathname - The requested path for re-direction.  
       * @param {Array}  publicPathnames - Array listing public pathnames within the application.  
       * @param {Object}  history - History object for managing session history.
       */
      .catch(() => {
        if (publicPathnames.includes(pathname)) {
          history.push(pathname);
        } else {
          history.push('/login');
        }
      });
  };
}
