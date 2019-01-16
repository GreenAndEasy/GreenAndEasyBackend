import {combineReducers} from 'redux';
import currentUserReducer from './currentUserReducer';
import tippcardReducer from './tippcardsReducer';
import categoriesReducer from './categoriesReducer';
import interactionsReducer from './interactionsReducer';
import userTippcardsReducer from "./userTippcardsReducer";
import kindsReducer from "./kindsReducer";
import usersReducer from "./usersReducer";

export default combineReducers({
    auth: currentUserReducer,
    tippcards: tippcardReducer,
    userTippcards: userTippcardsReducer,
    categories: categoriesReducer,
    interactions: interactionsReducer,
    kinds: kindsReducer,
    users: usersReducer
})