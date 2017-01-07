import $ from 'jquery';
import config from 'util/config';

export function getFacebookLogin(user) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.user}/login/facebook`, {
            method: 'POST',
            data: user,
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}
