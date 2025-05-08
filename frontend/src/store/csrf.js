import Cookies from 'js-cookie';

//set csrf cookie to HTTP request for any verb w/o GET in it. 
export async function csrfFetch(url, options = {}) {
    
    //if there is not method, set it to GET
    options.method = options.method || 'GET';

    //if there is not header, set empty object
    options.headers = options.headers || {};

    //if not GET, content-type=json, cookie=xsrftoken
    if (options.method.toUpperCase() !== 'GET') {
        options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    //MAKE THE FETCH CALL
    const res = await window.fetch(url, options);


    //error handling
    if (res.status >= 400) throw res;

    //RETURN SUCCESSFUL RESPONSE
    return res;
}


export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
}