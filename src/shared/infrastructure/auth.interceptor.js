/**
 * IAM authentication interceptor for Axios.
 * Injects the JWT Bearer token into every outbound request when a user is authenticated.
 *
 * @param {import('axios').InternalAxiosRequestConfig} config - Axios request configuration.
 * @returns {import('axios').InternalAxiosRequestConfig} Updated configuration with Authorization header.
 */
export const authInterceptor = (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

/**
 * Axios response error handler that silences 401 errors on GET requests.
 * Returns default empty data so Chrome DevTools doesn't log the failed request.
 * Non-401 errors and non-GET 401s are re-thrown for upstream handling.
 *
 * @param {import('axios').AxiosError} error - Axios error object.
 * @returns {Promise<import('axios').AxiosResponse|import('axios').AxiosError>} Resolved or rejected promise.
 */
export const authErrorHandler = (error) => {
    if (error.response?.status === 401 && error.config?.method?.toLowerCase() === 'get') {
        const url = error.config.url || '';
        const data = url.includes('trend') ? [] : {};
        return Promise.resolve({ data });
    }
    return Promise.reject(error);
};
