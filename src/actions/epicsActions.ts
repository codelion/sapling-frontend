import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { IEpic } from 'types';

/**
 * Function to fetch the list of epics related to a specific board ID.
 * @param {number}  boardId - The ID of the board whose epics need to be fetched.
 * @returns {object} An object containing the type of action for fetching epics, the API service call, and the payload request and success information.
 */
export function fetchEpicsList(boardId: number) {
  return {
    type: 'FETCH_EPICS_LIST',
    /**
     * Method to call an API and retrieve the epics from the board using the boardId
     * There are no parameters directly required for this method as they are utilized internally
     * @returns {Promise} Returns a Promise which when resolved gives the epics on the specified board 
     */
    callApi: () => ApiService.get(`/board/${boardId}/epics`),
    payload: { request: { data: { boardId } }, success: { data: [] as IEpic[] } },
  } as const;
}

// This is a workaround and is obviously a duplicate.
// Until we have a better endpoint to get epics and sprints at one go,
// we will use this for the inter board dependency use case.

/**
 * Function to fetch the list of epics by board id.
 * @param {number} boardId - The id of the board for which the epics are to be fetched.
 * @returns {object} An object consisting of type, callApi method, and payload containing data related to request and success.
 */
export function fetchEpicsListByBoardId(boardId: number) {
  return {
    type: 'FETCH_EPICS_LIST_BY_BOARD_ID',
    /**
     * Method to call an API to get all the epics from a specific board.
     * @returns {Promise} Returns a promise that resolves to the response from the API call.
     */
    callApi: () => ApiService.get(`/board/${boardId}/epics`),
    payload: { request: { data: { boardId } }, success: { data: [] as IEpic[] } },
  } as const;
}

export function deleteEpic(epicId: number) {
  return {
    type: 'DELETE_EPIC',
    callApi: () => ApiService.del(`/epic/${epicId}`),
    payload: { request: { data: { epicId } }, success: { data: {} } },
  } as const;
}

export function createEpic(boardId: number, epicName: string, priority: number) {
  const data = {
    name: epicName,
    priority,
  };

  return {
    type: 'CREATE_EPIC',
    callApi: () => ApiService.post(`/board/${boardId}/epics`, { data }),
    payload: { request: { data: { boardId } }, success: { data: {} } },
  } as const;
}
