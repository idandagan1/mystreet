/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from 'app-router';
import configureStore from 'configure-store';
import $ from 'jquery';

const store = configureStore();

const Application = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);

$.ajaxSetup({
    contentType: 'application/json',
});

ReactDOM.render(Application, document.getElementById('application'));
