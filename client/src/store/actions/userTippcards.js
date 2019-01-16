import {GET_USERTIPPCARDS} from "./types";


export function getUserTippcards() {
    return function (dispatch) {
        fetch('/usertippcards')
            .then(res=> res.json())
            .then(userTippcards => dispatch({
                type: GET_USERTIPPCARDS,
                payload: userTippcards
            }));
    }
}