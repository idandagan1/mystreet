import axios from 'axios';

export function searchStreet(street) {
    return dispatch => {
        return axios.post('/mystreets/getStreet', street);
    }
}