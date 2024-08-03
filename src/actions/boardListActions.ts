import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { IBoard } from 'types';

/**
 * Function to fetch a list of boards from an API.
 * There are no parameters for this function.
 * @returns {object} which is an object of type 'const' that contains the fetch type, a fetch function call to the board endpoint, and a return payload defining the format.
 */
export function fetchBoardList() {
  const endpoint = `${config.API_URL}/boards`;

  return {
    type: 'FETCH_BOARD_LIST',
    /**
     * A method to make a GET request to a specified endpoint
     * @returns {Promise} Returns a promise that resolves with the response data from the API request.
     */
    callApi: () => ApiService.get(endpoint),
    payload: { request: {}, success: { data: [] as IBoard[] } },
  } as const;
}

/**
 * Creates a new board with provided name and owner's ID.
 * @param {string} boardName - Name of the new board.
 * @param {number} ownerId - ID of the owner of the new board.
 * @returns {object} Returns an action object containing type of the action, API call for the action, and initial payload related to the action.
 */
export function createBoard(boardName: string, ownerId: number) {
  const endpoint = `${config.API_URL}/boards`;
  const data = {
    name: boardName,
    owner: ownerId,
  };
  return {
    type: 'CREATE_BOARD',
    /**
     * An asynchronous function that makes a POST request to a given API endpoint with the provided data.
     * @param {String} endpoint - The API endpoint where the POST request needs to be made.
     * @param {Object} data - The payload that is to be sent in the body of the POST request.
     * @returns {Promise} Returns a Promise that resolves with the response of the POST request.
     */
    callApi: () => ApiService.post(endpoint, { data }),
    payload: { request: {}, success: { data: {} as IBoard } },
  } as const;
}
