import { BaseApi } from '@/shared/infrastructure/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js';
import { authInterceptor, authErrorHandler } from '@/shared/infrastructure/auth.interceptor.js';

const usersEndpointPath = import.meta.env.VITE_USERS_API_URL || 'users';
const categoriesEndpointPath = import.meta.env.VITE_CATEGORIES_API_URL || 'categories';
const transactionsEndpointPath = import.meta.env.VITE_TRANSACTIONS_API_URL || 'transactions';
const recurringTransactionsEndpointPath = import.meta.env.VITE_RECURRING_TRANSACTIONS_API_URL || 'recurring-transactions';
const invitationsEndpointPath = import.meta.env.VITE_INVITATIONS_API_URL || 'invitations';

/**
 * Infrastructure gateway for the Household bounded-context endpoints.
 * Provides family group, user, category, transaction, and invitation operations.
 *
 * @class HouseholdApi
 * @extends BaseApi
 */
export class HouseholdApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #usersEndpoint;
    /** @type {BaseEndpoint} */
    #categoriesEndpoint;
    /** @type {BaseEndpoint} */
    #transactionsEndpoint;
    /** @type {BaseEndpoint} */
    #recurringTransactionsEndpoint;
    /** @type {BaseEndpoint} */
    #invitationsEndpoint;

    /** Creates endpoint clients and attaches auth interceptors. */
    constructor() {
        super();
        this.addRequestInterceptor(authInterceptor);
        this.addResponseInterceptor(null, authErrorHandler);
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
        this.#categoriesEndpoint = new BaseEndpoint(this, categoriesEndpointPath);
        this.#transactionsEndpoint = new BaseEndpoint(this, transactionsEndpointPath);
        this.#recurringTransactionsEndpoint = new BaseEndpoint(this, recurringTransactionsEndpointPath);
        this.#invitationsEndpoint = new BaseEndpoint(this, invitationsEndpointPath);
    }

    /**
     * Fetches users visible to the authenticated user.
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>|Object>>} Users response.
     */
    getUsers() {
        return this.#usersEndpoint.getAll();
    }

    /**
     * Creates a group family for a specific user.
     * @param {string} userId - User identifier.
     * @param {Object} body - Group family payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Created group response.
     */
    createGroupFamily(userId, body) {
        return this.#usersEndpoint.http.post(`${usersEndpointPath}/${userId}/group-families`, body);
    }

    /**
     * Retrieves a group family by user and group ID.
     * @param {string} userId - User identifier.
     * @param {string|number} groupId - Group identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Group family response.
     */
    getGroupFamilyById(userId, groupId) {
        return this.#usersEndpoint.http.get(`${usersEndpointPath}/${userId}/group-families/${groupId}`);
    }

    /**
     * Retrieves family members.
     * @param {string} userId - User identifier.
     * @param {string|number} familyId - Family identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Members response.
     */
    getFamilyMembers(userId, familyId) {
        return this.#usersEndpoint.http.get(`${usersEndpointPath}/${userId}/families/${familyId}/members`);
    }

    /**
     * Assigns a role to a family member.
     * @param {string} userId - User identifier.
     * @param {string|number} familyId - Family identifier.
     * @param {string|number} memberId - Member identifier.
     * @param {string} role - Role to assign.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Updated member response.
     */
    assignMemberRole(userId, familyId, memberId, role) {
        return this.#usersEndpoint.http.patch(
            `${usersEndpointPath}/${userId}/families/${familyId}/members/${memberId}/role`,
            { role },
        );
    }

    /**
     * Fetches categories.
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>|Object>>} Categories response.
     */
    getCategories() {
        return this.#categoriesEndpoint.getAll();
    }

    /**
     * Fetches transactions.
     * @param {Object} params - Query parameters.
     * @returns {Promise<import('axios').AxiosResponse<Array<Object>|Object>>} Transactions response.
     */
    getTransactions(params) {
        return this.#transactionsEndpoint.http.get(this.#transactionsEndpoint.endpointPath, { params });
    }

    /**
     * Fetches user invitations.
     * @param {string} userId - User identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Invitations response.
     */
    getInvitations(userId) {
        return this.#invitationsEndpoint.http.get(this.#invitationsEndpoint.endpointPath, {
            params: { userId },
        });
    }
}
