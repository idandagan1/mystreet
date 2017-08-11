import mapActionTypes from './map-action-types';

export function mapInitialized(mapSettings) {
    return dispatch => {
        dispatch({
            type: mapActionTypes.INITIALIZED_MAP,
            data: { mapSettings },
        });
    };
}
