import { ILoginParams, IStoryRequest, STORY_REQUEST_ACTION } from '../types';
import ApiService from 'utils/ApiService';
import config from 'utils/config';
import { ISprint, IStory, IBoard } from 'types';
import { getNumberValue } from 'utils/Helpers';

/**
 * A function to fetch a specific board by id.
 * @param {number}  boardId - The id of the board to fetch.
 * @returns {object} An object containing the type of action, the API call, and the payload.
 */

export function fetchBoard(boardId: number) {
  const endpoint = `${config.API_URL}/login`;

  return {
    type: 'FETCH_BOARD',
    /**
     * Method to make a GET request to the API and fetch the details of a particular board.
     * @returns {Promise} Promise object represents the result of the API GET request.
     */
    callApi: () => ApiService.get(`/board/${boardId}`),
    payload: { request: { data: { boardId } }, success: { data: {} } },
  } as const;
}

/**
 * Deletes a board using its ID.
 * @param {number} boardId - The identifier of the board to be deleted.
 * @returns {object} The action to be dispatched, with the boardId specified in the request data 
 * and a callback function for the API service to call.
 */
export function deleteBoard(boardId: number) {
  return {
    type: 'DELETE_BOARD',
    /**
     * A method that calls an API service to delete a board based on the boardId.
     * Utilizes 'del' function from the ApiService.
     * @returns {Promise} A Promise which resolves to the server's response data 
     * or rejects with an error object. 
     */
    callApi: () => ApiService.del(`${config.API_URL}/board/${boardId}`),
    payload: { request: { data: { boardId } }, success: { data: {} } },
  } as const;
}

/**
 * Function for creating a Sprint in a Board.
 * @param {number}  boardId - The unique identifier of the board where the sprint will be created.
 * @param {ISprint}  sprint - An object containing details of the sprint to be created (name, capacity, goal).
 * @returns {object} An object containing the "CREATE_SPRINT" type, callApi function with a post request to the board API, and the payload data.
 */
export function createSprint(boardId: number, sprint: ISprint) {
  const { name, capacity, goal } = sprint;
  const data = {
    name,
    capacity,
    goal,
  };

  return {
    type: 'CREATE_SPRINT',
    /**
     * Method to post data to the specific API endpoint.
     * @param {none} None - This function does not accept any parameters.
     * @returns {Promise} Returns a Promise that resolves to the response of the API request.
     */
    callApi: () => ApiService.post(`${config.API_URL}/board/${boardId}/sprints`, { data }),
    payload: { request: { data: { boardId } }, success: { data: {} as ISprint } },
  } as const;
}

/**
 * Updates the properties of the given sprint.
 * @param {ISprint}  sprint - An object implementing the ISprint interface, representing a sprint with id, name, capacity and goal.
 * @returns {object} An object with the type of the action ('UPDATE_SPRINT'), a callApi function that performs the API call to update sprint, and the payload of the request and the success response.
 */
export function updateSprint(sprint: ISprint) {
  const { id, name, capacity, goal } = sprint;

  const data = {
    name,
    capacity,
    goal,
  };

  return {
    type: 'UPDATE_SPRINT',
    /**
     * Method to make an API call to update the data of a specific sprint on the server.
     * @param {None} No parameter for this function as all are pre-configured within.
     * @returns {Promise} Returns a Promise that resolves to the server's response to the PUT request.
     */
    callApi: () => ApiService.put(`${config.API_URL}/sprint/${id}`, { data }),
    payload: { request: { data: { sprint } }, success: { data: {} as ISprint } },
  } as const;
}

/**
 * Deletes a sprint by its ID.
 * @param {number} id - The ID of the sprint to be deleted.
 * @returns {Object} An object containing the deletion details, such as the request and response information.
 */
export function deleteSprint(id: number) {
  return {
    type: 'DELETE_SPRINT',
    /**
     * Method for making a delete call to the "/sprint/{id}" API endpoint.
     * Please note, this method doesn't accept any parameters directly, instead they're scoped within the method.
     * The `id` parameter used in API endpoint relies on the existence of a relevant `id` in the current method scope.
     *
     * @returns {Promise} Resolves with an object containing the HTTP response from a successful API DELETE request.
     */
    callApi: () => ApiService.del(`${config.API_URL}/sprint/${id}`),
    payload: { request: { data: { id } }, success: { data: {} as ISprint } },
  } as const;
}

/**
 * This function creates a story ticket in a specific board and epic based on input parameters.
 * 
 * @param {number} boardId - ID of the board where the story should be created
 * @param {number} epicId - ID of the epic where the story should be created
 * @param {string} description - Description of the story
 * @param {number} weight - Weight of the story (usually related to the estimated difficulty or workload)
 * 
 * @returns {object} An object containing various properties related to a story creation action. This includes 
 *                   the story creation API call, as well as the request and success payloads associated with the action.
 */
export function createStory(boardId: number, epicId: number, description: string, weight: number) {
  const data = {
    description,
    weight,
  };

  return {
    type: 'CREATE_STORY',
    /**
     * Method to call API for posting tickets to a specific board's epic in the system.
     * @param {Number}  boardId - The unique identifier for the board.
     * @param {Number}  epicId - The unique identifier for the epic.
     * @param {Object}  data - The information of the ticket to be posted.
     * @returns {Promise} Returns a promise that contains the response of the API call.
     */
    callApi: () => ApiService.post(`/board/${boardId}/epic/${epicId}/tickets`, { data }),
    payload: { request: { data: { boardId, epicId } }, success: { data: {} as IStory } },
  } as const;
}

/**
 * We may be deprecating the term Ticket and use Story. Occurrences of Ticket here
 * indicate changes that may be required in the backend.
 */
export function updateStory(boardId: number, story: IStory) {
  const { pin, id, epic: epicId, weight } = story;
  const data = {
    ...story,
    epic: getNumberValue(epicId),
    weight: getNumberValue(weight),
  };
  /**
   * Function for changing the pin status of a ticket in a board. 
   * If a pin is present, it posts a new pin with the ticketId and sprintId to the board's pins.
   * If no pin is present, it deletes the pin with the ticketId from the board's pins.
   * @param {Number/String} pin - The ID of the pin. If no pin is given, the function will remove the pin from the board.
   * @param {Number/String} boardId - The ID of the Board.
   * @param {Number/String} ticketId - The ID of the Ticket.
   * @param {Number/String} sprintId - The ID of the Sprint. Only required when adding a new pin.
   * @returns {Object} Response from the API Service.
   */
  let changePin = () =>
    pin
      ? ApiService.post(`/board/${boardId}/pins`, { data: { ticketId: id, sprintId: pin } })
      : ApiService.del(`/board/${boardId}/pins`, { data: { ticketId: id } });

  return {
    type: 'UPDATE_STORY',
    /**
     * This method calls three different API endpoints in parallel; one to update a ticket, one to update an epic's ticket, and one to change the pin.
     * @returns {Promise} Returns a promise that resolves to an array containing the result from each API call.
     */
    callApi: () =>
      Promise.all([
        ApiService.put(`/ticket/${id}`, {
          data,
        }),
        ApiService.put(`/epic/${epicId}/ticket/${id}`),
        changePin(),
      ]),
    payload: {
      request: { data: { story: data } },
      success: { data: {} as IStory },
    },
  } as const;
}

/**
 * Delete a specific story using the given id and sprintId.
 * @param {number} id - The id of the story to be deleted.
 * @param {number} sprintId - The id of the sprint from which the story should be deleted.
 * @returns {object} A constant object containing the type of action, callApi method to delete the story, and payload.
 */
export function deleteStory(id: number, sprintId: number) {
  return {
    type: 'DELETE_STORY',
    /**
     * Method that calls an API to delete a specific ticket by its ID using ApiService
     * @returns {Object} A promise that resolves to the response of the deletion request
     */
    callApi: () => ApiService.del(`/ticket/${id}`),
    payload: { request: { data: { storyId: id, sprintId } }, success: { data: {} as ISprint } },
  } as const;
}

/**
 * A function to solve the puzzle board with the provided boardId. This function makes an API POST call to `/board/:boardId` endpoint.
 * @param {number} boardId - The unique id of the board that needs to be solved.
 * @returns {object} An object which contains type, callApi and a payload of request and success. The callApi is a function that makes api call and payload contains details of the board.
 */

export function solve(boardId: number) {
  return {
    type: 'SOLVE',
    /**
     * Method to call the API and post data to a specific board.
     * No parameters required as method is an arrow function and boardId is defined elsewhere in the implementation.
     * @returns {Promise} Returns a Promise that is resolved with the response data of the post request.
     */
    callApi: () => ApiService.post(`/board/${boardId}`),
    payload: { request: { data: { boardId } }, success: { data: {} as IBoard } },
  } as const;
}

/**
 * Adds a dependency between two stories on a specific board.
 * @param {number}  boardId - The ID of the board where the stories are located.
 * @param {number}  fromStoryId - The ID of the story that depends on another.
 * @param {number}  toStoryId - The ID of the story that is depended on.
 * @returns {object} An action object containing request type, API call, and payload specifying board and story IDs.
 */
export function addDependency(boardId: number, fromStoryId: number, toStoryId: number) {
  return {
    type: 'ADD_DEPENDENCY',
    /**
     * Makes a POST request to the API to create a dependency between two tickets on a board.
     * @param {String} boardId - The ID of the board the tickets belong to.
     * @param {String} fromStoryId - The ID of the ticket the dependency is from.
     * @param {String} toStoryId - The ID of the ticket the dependency is to.
     * @returns {Promise} A Promise that resolves to the response of the API call.
     */
    callApi: () =>
      ApiService.post(`/board/${boardId}/dependencies`, {
        data: { fromTicketId: fromStoryId, toTicketId: toStoryId },
      }),
    payload: {
      request: { data: { boardId, fromStoryId, toStoryId } },
    },
  } as const;
}

/**
 * This function deletes a dependency between two stories on a board.
 * @param {number} boardId - The ID of the board where the stories reside.
 * @param {number} fromStoryId - The ID of the story which is dependency of the target story.
 * @param {number} toStoryId - The ID of the story where the dependency is to be removed.
 * @returns {Object} An object containing the type of the operation, the API call object, and the request payload.
 */
export function deleteDependency(boardId: number, fromStoryId: number, toStoryId: number) {
  return {
    type: 'DELETE_DEPENDENCY',
    /**
     * Method to call the API to delete dependencies between tickets in a board.
     * @param {string} boardId - The unique identifier of the board.
     * @param {object} data - An object containing the ids of the tickets from which dependencies have to be removed.
     * @param {string} data.fromTicketId - The identifier of the ticket where the dependency starts.
     * @param {string} data.toTicketId - The identifier of the ticket where the dependency ends.
     * @returns {Promise} A Promise that, when fulfilled, returns an AxiosResponse object that contains the response of the DELETE request.
     */
    callApi: () =>
      ApiService.del(`/board/${boardId}/dependencies`, {
        data: { fromTicketId: fromStoryId, toTicketId: toStoryId },
      }),
    payload: {
      request: { data: { boardId, fromStoryId, toStoryId } },
    },
  } as const;
}

/**
 * A function that initiates the export of board data as a CSV file. 
 * It dispatches an action of the type 'EXPORT_CSV' along with the API service call to get the CSV file data for a specific board Id.
 * @param {Number}  boardId - The id of the board whose data is to be exported. 
 * @returns {const} An object consisting of the type of action, the API service call for getting the CSV data, and payload containing request data along with the boardId.
 */
export function exportCsv(boardId: number) {
  return {
    type: 'EXPORT_CSV',
    /**
     * Calls an API to get csv data for a specific board.
     * @method callApi
     * @returns {Promise} Returns a promise that resolves with the requested CSV data.
     */
    callApi: () => ApiService.get(`/board/${boardId}/csv`, { headers: { Accept: 'text/csv' } }),
    payload: { request: { data: { boardId } } },
  } as const;
}

/**
 * Function to upload a CSV file for a particular board.
 * @param {number}  boardId - The ID of the board where the CSV file should be uploaded.
 * @param {Object}  file - The CSV file data to be uploaded.
 * @returns {Object} Returns an object with the action type 'UPLOAD_CSV', the API call for the POST request, and the payload of the request.
 */
export function uploadCsv(boardId: number, file) {
  const formData = new FormData();
  formData.append('file', file);

  return {
    type: 'UPLOAD_CSV',
    /**
     * Method to call the API and post data to a specified API endpoint.
     * @param {Object} formData - Data to be posted.
     * @param {Number} boardId - Unique identifier of the board.
     * @returns {Promise} Returns a promise that resolves to a response object when the API call is successful.
     */
    callApi: () =>
      ApiService.post(`/board/${boardId}/csv`, {
        data: formData,
        headers: { type: '' },
      }),
    payload: { request: { data: { boardId } } },
  } as const;
}

/**
 * Function to create a story request. The function constructs an object to create a new story request.
 * @param {number} boardId - The id of the board where the story request will be created.
 * @param {IStoryRequest} storyRequest - Object containing parameters/data of the story request.
 * @returns {Object} An object containing the type of the request, the API call to be made along with parameters 
 * and the payload information including any data and success handlers.
 */
export function createStoryRequest(boardId: number, storyRequest: IStoryRequest) {
  return {
    type: 'CREATE_STORY_REQUEST',
    /**
     * Makes a POST request to the `boardId` endpoint with the `storyRequest` data object.
     * Note that the specific `boardId` and `storyRequest` variables to be used have to be defined elsewhere in the code.
     * @method
     * @returns {Promise} Promise object represents the response returned by the API
     */
    callApi: () => ApiService.post(`/board/${boardId}/requests`, { data: storyRequest }),
    payload: { request: { data: { storyRequest } }, success: { data: {} as IStoryRequest } },
  } as const;
}

/**
 * This function handles the business logic for withdrawing a story request from a board.
 * @param {number} boardId - The id of the board where the story request has been made.
 * @param {IStoryRequest} storyRequest - The story request object to be withdrawn.
 * @returns {object} An object containing type of action, API call details and payload
 */
export function withdrawStoryRequest(boardId: number, storyRequest: IStoryRequest) {
  const { id, notes } = storyRequest;

  return {
    type: 'WITHDRAW_STORY_REQUEST',
    /**
     * Invokes API to post a withdrawal request.
     * @param {string} boardId - Represents the unique identifier of the board.
     * @param {string} id - Represents the unique identifier of the request.
     * @param {object} notes - Optional data associated with the withdrawal request.
     * @returns {Promise} Returns a promise that resolves with the server response.
     */
    callApi: () => ApiService.post(`/board/${boardId}/request/${id}/withdraw`, { data: { notes } }),
    payload: { request: { data: { storyRequest } }, success: { data: {} as IStoryRequest } },
  } as const;
}

/**
 * Function to either accept or reject a story request.
 * @param {number}  boardId - The unique identifier of the board.
 * @param {number}  requestId - The unique identifier of the request.
 * @param {STORY_REQUEST_ACTION.Accept | STORY_REQUEST_ACTION.Reject}  action - The action decided for the request, either Accept or Reject.
 * @param {string}  notes - Any relevant notes or comments about the action taken.
 * @returns {object} An action object containing the type of the action, API call function, and payload with data – requestId and success status.
 */
export function acceptOrRejectStoryRequest(
  boardId: number,
  requestId: number,
  action: STORY_REQUEST_ACTION.Accept | STORY_REQUEST_ACTION.Reject,
  notes: string
) {
  return {
    type: 'ACCEPT_STORY_REQUEST',
    /**
     * A method to call an API which performs a specific action on a request in a board.
     * @param {string} boardId - The unique identifier for the board.
     * @param {string} requestId - The unique identifier for the request.
     * @param {string} action - The action to be performed on the request. This should be in lower case.
     * @param {object} data - An object which contains the data to be sent to the API. Currently it contains only "notes".
     * @returns {Promise} Returns a promise that resolves to the result of the API call.
     */
    callApi: () =>
      ApiService.post(`/board/${boardId}/request/${requestId}/${action.toLowerCase()}`, {
        data: { notes },
      }),
    payload: { request: { data: { requestId } }, success: {} },
  } as const;
}

// This is just a workaround and needs revision because this is a duplicate of FETCH_BOARD action
// Requires endpoint to return epics and sprints by board Id
// Use case for this now is to retrieve epic and sprints to select for interboard dependency
export function fetchBoardDetails(boardId: number) {
  const endpoint = `${config.API_URL}/boards`;

  return {
    type: 'FETCH_BOARD_DETAILS',
    /**
     * An arrow function that performs GET request to retrieve a specific board using its ID.
     * @returns {Promise<Object>} Returns a Promise that resolves to the data of the requested board.
     */
    callApi: () => ApiService.get(`/board/${boardId}`),
    payload: { request: { data: { boardId } }, success: { data: {} } },
  } as const;
}
