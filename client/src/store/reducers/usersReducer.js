import {GET_USERS} from "../actions/types";

const initialState = {
    user: []  // post from our action
}


export default function(state=initialState,action) {
    switch(action.type) {
        case GET_USERS:
            return {
                ...state,
                users: action.payload
            }
        default:
            return state;
    }
}