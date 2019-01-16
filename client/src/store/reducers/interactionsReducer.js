import { GET_INTERACTIONS} from "../actions/types";

const initialState = {
    interactions: [],  // post from our action
}


export default function(state=initialState,action) {
    switch(action.type) {
        case GET_INTERACTIONS:
            return {
                ...state,
                interactions: action.payload
            };
        default:
            return state;
    }
}