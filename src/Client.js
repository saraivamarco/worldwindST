import fetch from 'unfetch';

/**
 * SAMPLE REST SERVICE CONSUMER
 * @param {*} response 
 * @returns 
 */

const checkStatus = response => {
    if (response.ok) {
        return response;
    }
    // convert non-2xx HTTP responses into errors:
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

// Dummmy data
export const getAllItems = () =>
    fetch("https://gorest.co.in/public/v1/users")
        .then(checkStatus);


