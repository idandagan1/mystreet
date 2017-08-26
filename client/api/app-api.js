import $ from 'jquery';
import config from 'util/config';

export function getUserLocation() {
    return new Promise((resolve, reject) => {
        $.get('https://ipinfo.io', response => {
            resolve(response);
        }, 'jsonp');
    });
}
