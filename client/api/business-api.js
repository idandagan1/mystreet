import $ from 'jquery';
import config from 'util/config';

export function getUsersByRadius(radius, coords) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.user}/getUsersByRadius?radius=${radius}&coords=${JSON.stringify(coords)}`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}
