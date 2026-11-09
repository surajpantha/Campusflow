const API_BASE_URL = "/api"

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";


//token storage
export function getAccessToken() {
    return sessionStorage.getItem(ACCESS_KEY);

}
export function getRefreshToken() {
    return sessionStorage.getItem(REFRESH_KEY);

}

export function saveTokens(access, refresh) {
    sessionStorage.setItem(ACCESS_KEY, access);
    sessionStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);

}

// Shared Promise: prevents multiple simultaneous refresh requests.
let refreshPromise = null;

// Performs the actual refresh request.
async function performRefresh() {
    const refresh = getRefreshToken();

    if (!refresh) {
        clearTokens();
        return false;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/accounts/refresh/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh }),
            }
        );

        if (!response.ok) {
            clearTokens();
            return false;
        }

        const data = await response.json();

        saveTokens(data.access, data.refresh || refresh);

        return true;
    } catch {
        return false;
    }
}

// All callers share the same refresh operation.
function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
}

// Central API request function
async function apiRequest(endpoint, options = {}, retry = true) {
    const {
        body,
        headers = {},
        ...otherOptions
    } = options;
    const requestHeaders = {
        ...headers,
    };
    if (body !== undefined) {
        requestHeaders['Content-Type'] = 'application/json';
    }
    const access = getAccessToken();
    if (access) {
        requestHeaders.Authorization = `Bearer ${access}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`,
        {
            ...otherOptions,
            headers: requestHeaders,
            body: body === undefined ? undefined : JSON.stringify(body),
        });

    //    if access token expired,refresh and retry once
    if (
        response.status === 401 &&
        retry &&
        getRefreshToken() &&
        !endpoint.includes('/accounts/refresh/')
    ) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            return apiRequest(endpoint, options, false);
        }
        clearTokens();
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const message = data?.detail ||
            data?.non_field_errors?.[0] ||
            'Something went wrong';
        const error = new Error(message);
        error.status = response.status;
        error.data = data;

        throw error;
    }
    return data;
}


// convenient http methods


export const api = {
    get: (endpoint) =>
        apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint, body) =>
        apiRequest(endpoint, { method: 'POST', body }),
    patch: (endpoint, body) =>
        apiRequest(endpoint, { method: 'PATCH', body }),

    delete: (endpoint) =>
        apiRequest(endpoint, { method: 'DELETE' }),

};

