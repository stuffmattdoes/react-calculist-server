import Dispatcher from '../dispatcher/Dispatcher';

const ServerResponseActions = {
    receiveAllItems: function(response) {
        Dispatcher.dispatch({
            type: 'RECEIVE_ITEMS',
            data: response
        });
    },

    receiveAllLists: function(response) {
        Dispatcher.dispatch({
            type: 'RECEIVE_LISTS',
            data: response
        });
    },

    receiveTokenRefreshSuccess: function(response) {
        Dispatcher.dispatch({
            type: 'RECEIVE_TOKEN_REFRESH_SUCCESS',
            data: response
        });
    },

    receiveTokenRefreshError: function(response) {
        Dispatcher.dispatch({
           type: 'RECEIVE_TOKEN_REFRESH_ERROR',
            data: response
        });
    },

    receiveUserLoginSuccess: function(response) {
        Dispatcher.dispatch({
            type: 'RECEIVE_USER_LOGIN_SUCCESS',
            data: response
        });
    },

    receiveUserLoginError: function(response) {
        Dispatcher.dispatch({
            type: 'RECEIVE_USER_LOGIN_ERROR',
            data: response
        });
    },

    receiveUserRegisterSuccess: function(response) {
        Dispatcher.dispatch({
            type: 'RECEIVE_USER_REGISTER_SUCCESS',
            data: response
        });
    },

    receiveUserRegisterError: function(response) {
        Dispatcher.dispatch({
            type: 'RECEIVE_USER_REGISTER_ERROR',
            data: response
        });
    },

}

export default ServerResponseActions;
