import axios from 'axios';

/**
 * Base URL for the Intiva API platform, read from environment variables.
 * @type {string}
 */
const platformApi = `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PATH}`;

/**
 * Shared infrastructure base class that creates and exposes a pre-configured Axios instance.
 * All bounded-context API gateways should extend this class.
 *
 * @class BaseApi
 */
export class BaseApi {
    /** @type {import('axios').AxiosInstance} */
    #http;

    /**
     * Initialises the Axios HTTP client with the platform base URL and default headers.
     * The base URL is assembled from `VITE_API_BASE_URL` + `VITE_API_PATH`.
     */
    constructor() {
        this.#http = axios.create({
            baseURL: platformApi,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    /**
     * Exposes the pre-configured Axios instance so subclasses and endpoint clients
     * can attach interceptors or perform requests.
     *
     * @returns {import('axios').AxiosInstance} Configured Axios instance.
     */
    get http() {
        return this.#http;
    }

    /**
     * Attaches a request interceptor to the Axios instance.
     * @param {Function} onFulfilled - Interceptor handler.
     * @returns {number} Interceptor ID for ejection.
     */
    addRequestInterceptor(onFulfilled) {
        return this.#http.interceptors.request.use(onFulfilled);
    }

    /**
     * Attaches a response interceptor to the Axios instance.
     * @param {Function} onFulfilled - Success handler.
     * @param {Function} onRejected - Error handler.
     * @returns {number} Interceptor ID for ejection.
     */
    addResponseInterceptor(onFulfilled, onRejected) {
        return this.#http.interceptors.response.use(onFulfilled, onRejected);
    }
}
