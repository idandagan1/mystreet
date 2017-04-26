import $ from 'jquery';
import config from 'util/config';


export function addPost(post, streetId) {
    const data = {
        streetId,
        post,
    }

    return new Promise((resolve, reject) => {
        $.ajax(`${config.posts}/addPost`, {
            method: 'POST',
            data: JSON.stringify(data),
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}

export function getPostsByPlaceId(place_id) {
    if (!place_id) {
        return;
    }

    return new Promise((resolve, reject) => {
        $.ajax(`${config.posts}/getPostsByPlaceId?place_id=${place_id}`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}
