import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as reducers from 'state/reducers';
import loggingMiddleWare from 'middleware/logging-middleware';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

export default function configureStore() {
    const combinedReducers = combineReducers(Object.assign({}, reducers, {
        routing: routerReducer,
    }));

    const store = createStore(
        combinedReducers,
        applyMiddleware(
            routerMiddleware(browserHistory),
            thunk,
            loggingMiddleWare,
        )
    );

    return store;
}
