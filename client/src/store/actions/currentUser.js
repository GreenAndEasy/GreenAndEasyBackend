import {GET_CURRENT_USER, SET_CURRENT_USER} from "./types";


export function getCurrentUser() {
    return function (dispatch) {
        fetch('/currentUser')
            .then(res=> res.json())
            .then(currentUser => dispatch({
                type: GET_CURRENT_USER,
                payload: currentUser
            }));
    }
}

export function setCurrentUser(userData) {
    return function (dispatch) {
        fetch('/currentUser',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: userData
        }).then(res => res.text())
            .then(newUser => dispatch({
                type: SET_CURRENT_USER,
                payload: newUser
            }));
    }
}