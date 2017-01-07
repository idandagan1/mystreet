import $ from 'jquery';
import config from 'util/config';

export function getStreet(placeId) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.mystreets}/getStreet?place_id=${placeId}`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}
