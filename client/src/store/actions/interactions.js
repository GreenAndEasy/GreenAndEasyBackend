import {GET_INTERACTIONS} from "./types";


export function getInteractions() {
    return function (dispatch) {
        fetch('/interactions')
            .then(res=> res.json())
            .then(interactions => dispatch({
                type: GET_INTERACTIONS,
                payload: interactions
            }));
    }
}