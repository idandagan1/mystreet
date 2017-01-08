import appActionTypes from './app-action-types';

export function appLoaded() {
    return (dispatch, getState) => {
        window.state = getState;
        dispatch({
            type: appActionTypes.LOADED,
        });
    };
}
