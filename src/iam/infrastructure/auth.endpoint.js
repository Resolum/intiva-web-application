import { IamApi } from '@/iam/infrastructure/iam-api.js'

const iamApi = new IamApi();

/**
 * Auth endpoint gateway providing sign-in operations.
 * Wraps the IamApi infrastructure class and transforms errors into i18n-friendly messages.
 */
export const authEndpoint = {
    /**
     * Sends sign-in credentials to the authentication endpoint.
     * @param {Object} credentials - Sign-in credentials payload.
     * @returns {Promise<Object>} Authentication response data.
     * @throws {Error} With i18n error key on failure.
     */
    async signIn(credentials) {
        try {
            const response = await iamApi.signIn(credentials);
            return response.data;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400 || status === 401) {
                    throw new Error('login.errors.invalidCredentials');
                }
            }
            throw new Error('login.errors.serverError');
        }
    },
}
