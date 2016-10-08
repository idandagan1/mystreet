import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './app-router';
import configureStore from './configure-store';

const store = configureStore();

const Application = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);

ReactDOM.render(Application, document.getElementById('application'));
