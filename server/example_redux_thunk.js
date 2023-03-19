const redux = require('redux')
const thunkMiddleware = require('redux-thunk').default
const axios = require('axios')
const createStore = redux.createStore
const applyMiddleware = redux.applyMiddleware

const initialState = {
  loading: false,
  users: [],
  error: ''
}

//Three action types are defined as constants
//each representing a different stage of the API request (requesting, success, and failure).
const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST'
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE'

// Three action creators are defined, each corresponding to the action types defined above. 
// They return an action object that contains the type and a payload.
const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST
  }
}

const fetchUsersSuccess = users => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users
  }
}

const fetchUsersFailure = error => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error
  }
}
// fetchUsers is a "thunk action creator" that dispatches the request, success, and failure actions at different stages of the API call. It uses Axios to make a GET request to the specified URL, and then dispatches either fetchUsersSuccess or fetchUsersFailure depending on the outcome of the request.
const fetchUsers = () => {
  return function (dispatch) {   // argument dispatch fcn is provided by the store / through -> store.dispatch(fetchUsers()) below
    dispatch(fetchUsersRequest())   
    // dispatched to the reducer function in this case is type = FETCH_USERS_REQUEST while store state is initialState
    // updated state -> { loading: true, users: [], error: '' }/going into reducer actiontype : 'FETCH_USERS_REQUEST '
    axios
      .get('https://jsonplacehoder.typicode.com/users') //call is made when response/error arrives, one of 2 things happen (.then or .catch)
      .then(response => {
        // response.data is the users
        const users = response.data.map(user => user.id)
        dispatch(fetchUsersSuccess(users))       
         // dispatched to the reducer function in this case is type = FETCH_USERS_SUCCESS AND action.payload is equal to the users data (ids in our case)
         // updated state -> { loading: false, users: [1,2,..], error: '' }/ going into reducer actiontype = 'FETCH_USERS_SUCCESS '
        })
        .catch(error => {
          // error.message is the error message
          dispatch(fetchUsersFailure(error.message))
          // dispatched to the reducer function in this case is type = FETCH_USERS_FAILURE AND action.payload is equal to the error message 
          // updated state -> { loading: false, users: [],error: 'getaddrinfo ENOTFOUND...'}/going into reducer actiontype = 'FETCH_USERS_FAILURE '
      })
  }
}

// The reducer function takes the previous state and an action as arguments, and returns the new state based on the type of action.
const reducer = (state = initialState, action) => {
  console.log(action.type)
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: ''
      }
    case FETCH_USERS_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload
      }
  }
}
// The state store is created using createStore, passing the reducer function and applying thunkMiddleware.
const store = createStore(reducer, applyMiddleware(thunkMiddleware))
// The state store is subscribed to console log updated state.
store.subscribe(() => { console.log(store.getState()) })
// the fetchUsers action is dispatched to trigger the API call and update the state
store.dispatch(fetchUsers())
// In a Redux context, dispatch is a method provided by the Redux store that allows you to trigger an action and update the state of the application. When you call dispatch with an action object, the Redux store will pass the action and the current state to the root reducer, which will compute the new state based on the action type and return the updated state. This updated state will then replace the previous state in the store and trigger any registered listeners, such as component re-renders.

// In essence, dispatch is the mechanism by which you communicate changes to the state of your application to Redux. By dispatching actions, you can describe changes to the state in a declarative manner, which makes your code more predictable and easier to maintain.

// ***************************************************************************
//  When fetchUsers() is dispatched , the following steps take place:
// ***************************************************************************

// The fetchUsers thunk action creator is invoked and it returns a function that takes dispatch as an argument.
// The function returned by fetchUsers is immediately invoked and passed the dispatch function provided by the store.
// The first action that is dispatched is fetchUsersRequest, which updates the state to reflect that a request for users has started. The loading status is set to true.
// Axios makes a GET request to the specified URL, and when the response is received, the data is processed.
// If the request was successful, fetchUsersSuccess action is dispatched, which updates the state to reflect that the request was successful. The loading status is set to false, the user IDs are stored in the users property, and the error property is set to an empty string.
// If the request failed, fetchUsersFailure action is dispatched, which updates the state to reflect that the request failed. The loading status is set to false, the users property is set to an empty array, and the error property is set to the error message received from the request.
// The new state computed by the reducer function replaces the previous state in the store.
// The state store's subscribe method logs the updated state to the console.
// Note that dispatching an action is asynchronous and it will trigger the processing of the action in the store, but it won't block further execution of the code. In this case, after dispatching the fetchUsers action, the code continues to execute and logs the updated state to the console.
