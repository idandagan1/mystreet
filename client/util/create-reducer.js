// ref: https://github.com/rackt/redux/issues/1024#issuecomment-156100130

export default function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        }

        return state;
    };
}
