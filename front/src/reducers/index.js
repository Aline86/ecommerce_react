import {combineReducers} from 'redux'
import {userReducer} from './userReducer';
import {searchReducer} from './searchReducer';
// Liste des reducers utilisés dans l'application pour les co au store de index.js à la racine de l'application
const rootReducer = combineReducers({
    user: userReducer,
    search: searchReducer,
})

export default rootReducer