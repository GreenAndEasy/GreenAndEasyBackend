import {GET_KINDS} from "./types";


export function getKinds() {
    return function (dispatch) {
        fetch('/kinds')
            .then(res=> res.json())
            .then(kinds => dispatch({
                type: GET_KINDS,
                payload: kinds
            }));
    }
}