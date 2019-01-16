import { GET_CURRENT_USER, SET_CURRENT_USER} from "../actions/types";

const initialState = {
    currentUser: [],  // post from our action
    newUser: {}    // single post we add
}


export default function(state=initialState,action) {
    switch(action.type) {
        case GET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        case SET_CURRENT_USER:
            return {
                ...state,
                newUser: action.payload
            }
        default:
            return state;
    }
}