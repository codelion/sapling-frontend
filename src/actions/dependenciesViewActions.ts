import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { ICrossDeps } from 'types';

/**
 * Fetches the dependencies of a board. Information is fetched from the API, including type of board, API call and payload data.
 * 
 * @returns {object} An object containing type of fetching, API call and the payload data.
 */

export function fetchDependencies() {
  const endpoint = `${config.API_URL}/boards/dependencies`;

  return {
    type: 'FETCH_CROSS_BOARD_DEPENDENCIES',
    /**
     * A method that calls ApiService and returns a Promise from a GET request.
     * @returns {Promise} A Promise that contains the response from the GET request.
     */
    callApi: () => ApiService.get(endpoint),
    payload: { request: {}, success: { data: null as ICrossDeps } },
  } as const;
}
