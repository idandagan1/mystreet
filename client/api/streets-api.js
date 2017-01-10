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

export function addStreet(street, userId) {
    const { placeId: place_id, street: name, location } = street;
    const data = {
        place_id,
        name,
        location,
        userId,
    };

    return new Promise((resolve, reject) => {
        $.ajax(`${config.mystreets}/addStreet`, {
            method: 'POST',
            data: JSON.stringify(data),
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}
