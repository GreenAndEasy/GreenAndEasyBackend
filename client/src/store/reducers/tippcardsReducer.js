import { GET_TIPPCARDS} from "../actions/types";

const initialState = {
    tippcards: [],  // post from our action
}


export default function(state=initialState,action) {
    switch(action.type) {
        case GET_TIPPCARDS:
            return {
                ...state,
                tippcards: action.payload
            }
        default:
            return state;
    }
}