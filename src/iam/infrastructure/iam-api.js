import { BaseApi } from '@/shared/infrastructure/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js';
import { authInterceptor, authErrorHandler } from '@/shared/infrastructure/auth.interceptor.js';

const signInEndpointPath = import.meta.env.VITE_SIGN_IN_PATH;

/**
 * Infrastructure gateway for IAM (Identity & Access Management) bounded-context endpoints.
 * Provides authentication operations against the Intiva API.
 *
 * @class IamApi
 * @extends BaseApi
 */
export class IamApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #signInEndpoint;

    /** Creates endpoint clients and attaches auth interceptors. */
    constructor() {
        super();
        this.addRequestInterceptor(authInterceptor);
        this.addResponseInterceptor(null, authErrorHandler);
        const token = localStorage.getItem('auth_token');
        if (token && token !== 'undefined') {
            this.http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        this.#signInEndpoint = new BaseEndpoint(this, signInEndpointPath);
    }

    /**
     * Sends sign-in credentials to the authentication endpoint.
     * @param {Object} credentials - Sign-in payload (email, password).
     * @returns {Promise<import('axios').AxiosResponse<Object>>} HTTP response with auth payload.
     */
    signIn(credentials) {
        return this.#signInEndpoint.create(credentials);
    }
}
