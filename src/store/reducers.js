import languages from '../api/languages.json'
import {
    CHANGE_STDIN,
    CHANGE_CODE,
    CHANGE_LANG,

    REQUEST_INIT,
    REQUEST_SUCCESS,
    REQUEST_ERROR,
    REQUEST_QUEUED
} from './actions'
import { combineReducers } from 'redux'
let defaultState = {
    editor: {
        code: '',
        lang: languages[0].name,
        stdin: ''
    },
    request: {
        init: false,
        completed: false,
        error: null,
        token: null,
        output: null
    }
}

function editor(state = defaultState.editor, action) {
    switch (action.type) {
        case CHANGE_CODE:
            // console.log('code:', action.code)
            return {
                ...state,
                code: action.code
            }
        case CHANGE_STDIN:
            // console.log('stdin:', action.stdin)
            return {
                ...state,
                stdin: action.stdin
            }
        case CHANGE_LANG: {
            // console.log('lang:', action.lang)
            return {
                ...state,
                lang: action.lang
            }
        }
        default:
            return state
    }
}
function request(state = defaultState.request, action) {
    switch (action.type) {
        case REQUEST_INIT:
            // console.log('request init')
            return {
                ...defaultState.request,
                init: true,
            }
        case REQUEST_ERROR:
            // console.log('request error:', action.error)
            return {
                ...state,
                error: action.error,
                completed: true
            }
        case REQUEST_QUEUED:
            // console.log('request queued')
            return {
                ...state,
                token: action.token,
                output: action.output
            }
        case REQUEST_SUCCESS:
            // console.log('request success, output=', action.output)
            return {
                ...state,
                output: action.output,
                completed: true
            }
        default:
            return state
    }
}

export default combineReducers({
    editor,
    request
});