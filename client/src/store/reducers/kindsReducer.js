import { GET_KINDS} from "../actions/types";

const initialState = {
    kinds: [],  // post from our action
}


export default function(state=initialState,action) {
    switch(action.type) {
        case GET_KINDS:
            return {
                ...state,
                kinds: action.payload
            };
        default:
            return state;
    }
}
