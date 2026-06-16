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
 * Axios response error handler that redirects unauthenticated users to the sign-in page.
 *
 * @param {import('axios').AxiosError} error - Axios error object.
 * @returns {Promise<import('axios').AxiosError>} Rejected promise with the original error.
 */
export const authErrorHandler = (error) => {
    if (error.response?.status === 401) {
        const isLoginPage = window.location.pathname === '/sign-in';
        if (!isLoginPage) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.location.href = '/sign-in';
        }
    }
    return Promise.reject(error);
};
