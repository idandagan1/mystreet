import $ from 'jquery';
import config from 'util/config';

export function getStreetByPlaceId(placeId) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.mystreets}/getStreetByPlaceId?place_id=${placeId}`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}

export function getPostsFeed(street) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.mystreets}/getNearbyStreets?location=${JSON.stringify(street.location)}`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}

export function getNearbyStreets(street) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.mystreets}/getNearbyStreets?location=${JSON.stringify(street.location)}`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}

export function getMembers(placeId) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.mystreets}/getMembers?place_id=${placeId}`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}

export function getSelectedStreet() {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.mystreets}/getSelectedStreet`, {
            method: 'GET',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}

export function changePrimaryStreet(streetId) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.mystreets}/changePrimaryStreet?street_id=${streetId}`, {
            method: 'POST',
            success: (res, status, xhr) => resolve(res),
            error: (xhr, status, error) => reject(xhr.responseJSON),
        });
    });
}

export function addStreet(street) {
    const { place_id, streetName, location, address } = street;
    const data = {
        place_id,
        streetName,
        location,
        address,
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
