import {GET_USERS} from "./types";


export function getUsers() {
    return function (dispatch) {
        fetch('/users')
            .then(res=> res.json())
            .then(users => dispatch({
                type: GET_USERS,
                payload: users
            }));
    }
}