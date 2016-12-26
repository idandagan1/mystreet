import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from 'state/reducers';

export default function configureStore() {
    const combinedReducers = combineReducers(Object.assign({}, reducers));

    const store = createStore(
        combinedReducers,
        applyMiddleware(
            thunk
        )
    );

    return store;
}
