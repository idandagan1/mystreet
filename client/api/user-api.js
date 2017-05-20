import $ from 'jquery';
import config from 'util/config';

const fields = { fields: 'id,friends,about,age_range,cover,picture,birthday,context,email,first_name,last_name,gender,hometown,link,location,middle_name,name,timezone,website,work' };

export function getFacebookLogin(user) {

    return new Promise((resolve, reject) => {
        FB.api('/me', fields, (response) => {
            $.ajax(`${config.user}/login/facebook`, {
                method: 'POST',
                data: JSON.stringify(Object.assign({}, user, response)),
                success: (res, status, xhr) => resolve(res),
                error: (xhr, status, error) => reject(xhr.responseJSON),
            });
        });
    });

}

export function getActiveUser() {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.user}/getUserLogin`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}
