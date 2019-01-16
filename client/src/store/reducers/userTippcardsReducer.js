import {GET_USERTIPPCARDS} from "../actions/types";

const initialState = {
    userTippcards: [],  // post from our action
}


export default function(state=initialState,action) {
    switch(action.type) {
        case GET_USERTIPPCARDS:
            return {
                ...state,
                userTippcards: action.payload
            }
        default:
            return state;
    }
}