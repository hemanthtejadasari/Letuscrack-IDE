import { submitCodeToApi, checkStatusFromApi } from '../api'

/*action types */
export const CHANGE_STDIN = 'CHANGE_STDIN';
export const CHANGE_CODE = 'CHANGE_CODE';
export const CHANGE_LANG = 'CHANGE_LANG';

// export const SUBMIT_CODE = 'SUBMIT_CODE'

export const REQUEST_INIT = 'REQUEST_INIT'
export const REQUEST_QUEUED = 'REQUEST_QUEUED'
export const REQUEST_ERROR = 'REQUEST_ERROR'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'

/*action creators */
export function changeCode(code) {
    return {
        type: CHANGE_CODE,
        code
    }
}
export function changeStdin(stdin) {
    return {
        type: CHANGE_STDIN,
        stdin
    }
}
export function changeLang(lang) {
    return {
        type: CHANGE_LANG,
        lang
    }
}
export function requestInit() {
    return { type: REQUEST_INIT }
}
export function requestQueued(token, output) {
    return { type: REQUEST_QUEUED, token, output }
}
export function requestSuccess(output) {
    return { type: REQUEST_SUCCESS, output }
}
export function requestError(error) {
    return { type: REQUEST_ERROR, error }
}
export function submitCode(editor) {
    if (editor.code.trim() === '')
        return
    console.log('submitting code...')
    return (dispatch) => {
        dispatch(requestInit())
        submitCodeToApi(editor).then(responce => {
            if (responce.ok)
                return responce.json()
            else
                throw Error(responce.statusText)
        }).then(json => {
            let token = json.token;
            dispatch(requestQueued(token));
            console.log('request queued, calling checking result')
            dispatch(checkResult(token));
        }).catch(error => {
            dispatch(requestError(error));
        })
    }
}
export function checkResult(token) {
    return (dispatch, getState) => {
        let request = getState().request;
        if (request.completed || !request.init) {
            return
        }
        console.log('checking status')
        checkStatusFromApi(token).then(responce => {
            return responce.json()
        }).then(json => {
            let id = json.status.id;
            if (id <= 2) {
                dispatch(requestQueued(token, json))
                console.log('those bitches queued again, dispatching again in 1s');
                setTimeout(() => {
                    dispatch(checkResult(token))
                }, 1000)
            }
            else if (id >= 3) {
                dispatch(requestSuccess(json))
            }
        }).catch(error => {
            dispatch(requestError(error))
        })
    }
}