import axios from 'axios';

const API_BASE_URL = 'https://frosty-wood-6558.getsandbox.com';

export const saveDish = (payload) => {
    return axios.post(`${API_BASE_URL}/dishes`,
        normalizeNewDishRequestFields(payload)
    );
};

const normalizeNewDishRequestFields = (payload) => {
    if (payload.spiciness_scale) {
        payload.spiciness_scale = parseInt(payload.spiciness_scale);
    } else if (payload.slices_of_bread) {
        payload.slices_of_bread = parseInt(payload.slices_of_bread);
    } else if (payload.diameter) {
        payload.no_of_slices = parseInt(payload.no_of_slices);
        payload.diameter = parseFloat(payload.diameter)
    }
    return payload;
}