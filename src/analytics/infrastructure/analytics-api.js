import { BaseApi } from '@/shared/infrastructure/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/base-endpoint.js';
import { authInterceptor, authErrorHandler } from '@/shared/infrastructure/auth.interceptor.js';

const analyticsPrefix = import.meta.env.VITE_ANALYTICS_API_URL || 'analytics';

const summaryEndpoint = `${analyticsPrefix}/${import.meta.env.VITE_ANALYTICS_SUMMARY_URL || 'summary'}`;
const trendEndpoint = `${analyticsPrefix}/${import.meta.env.VITE_ANALYTICS_TREND_URL || 'trend'}`;
const savingGoalsEndpoint = `${analyticsPrefix}/${import.meta.env.VITE_ANALYTICS_SAVING_GOALS_URL || 'saving-goals'}`;
const spendingLimitsEndpoint = `${analyticsPrefix}/${import.meta.env.VITE_ANALYTICS_SPENDING_LIMITS_URL || 'spending-limits'}`;
const categoryRankingEndpoint = `${analyticsPrefix}/${import.meta.env.VITE_ANALYTICS_CATEGORIES_RANKING_URL || 'categories/ranking'}`;
const reportsGenerateEndpoint = `${analyticsPrefix}/${import.meta.env.VITE_ANALYTICS_REPORTS_GENERATE_URL || 'reports/generate'}`;
const reportsSummaryEndpoint = `${analyticsPrefix}/${import.meta.env.VITE_ANALYTICS_REPORTS_SUMMARY_URL || 'reports/summary'}`;

/**
 * Infrastructure gateway for the Analytics bounded-context endpoints.
 * Provides dashboard and report operations.
 *
 * @class AnalyticsApi
 * @extends BaseApi
 */
export class AnalyticsApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #summaryEndpoint;
    /** @type {BaseEndpoint} */
    #trendEndpoint;
    /** @type {BaseEndpoint} */
    #savingGoalsEndpoint;
    /** @type {BaseEndpoint} */
    #spendingLimitsEndpoint;
    /** @type {BaseEndpoint} */
    #categoryRankingEndpoint;
    /** @type {BaseEndpoint} */
    #reportsGenerateEndpoint;
    /** @type {BaseEndpoint} */
    #reportsSummaryEndpoint;

    /** Creates endpoint clients and attaches auth interceptors. */
    constructor() {
        super();
        this.addRequestInterceptor(authInterceptor);
        this.addResponseInterceptor(null, authErrorHandler);
        const token = localStorage.getItem('auth_token');
        if (token && token !== 'undefined') {
            this.http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        this.#summaryEndpoint = new BaseEndpoint(this, summaryEndpoint);
        this.#trendEndpoint = new BaseEndpoint(this, trendEndpoint);
        this.#savingGoalsEndpoint = new BaseEndpoint(this, savingGoalsEndpoint);
        this.#spendingLimitsEndpoint = new BaseEndpoint(this, spendingLimitsEndpoint);
        this.#categoryRankingEndpoint = new BaseEndpoint(this, categoryRankingEndpoint);
        this.#reportsGenerateEndpoint = new BaseEndpoint(this, reportsGenerateEndpoint);
        this.#reportsSummaryEndpoint = new BaseEndpoint(this, reportsSummaryEndpoint);
    }

    /**
     * Retrieves financial summary for a user.
     * @param {string} userId - User identifier.
     * @param {Object} params - Query parameters (periodType, periodStart, periodEnd).
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Summary response.
     */
    async getSummary(userId, params) {
        try {
            return await this.#summaryEndpoint.http.get(this.#summaryEndpoint.endpointPath, {
                params: { ownerId: userId, ownerType: 'INDIVIDUAL', ...params },
            });
        } catch {
            return { data: {} };
        }
    }

    /**
     * Retrieves balance trend data.
     * @param {string} userId - User identifier.
     * @param {Object} params - Query parameters.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Trend response.
     */
    async getTrend(userId, params) {
        try {
            return await this.#trendEndpoint.http.get(this.#trendEndpoint.endpointPath, {
                params: { ownerId: userId, ownerType: 'INDIVIDUAL', ...params },
            });
        } catch {
            return { data: [] };
        }
    }

    /**
     * Retrieves saving goals.
     * @param {string} userId - User identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Saving goals response.
     */
    async getSavingGoals(userId) {
        try {
            return await this.#savingGoalsEndpoint.http.get(this.#savingGoalsEndpoint.endpointPath, {
                params: { ownerId: userId, ownerType: 'INDIVIDUAL' },
            });
        } catch {
            return { data: {} };
        }
    }

    /**
     * Retrieves spending limits.
     * @param {string} userId - User identifier.
     * @param {Object} params - Query parameters.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Spending limits response.
     */
    getSpendingLimits(userId, params) {
        return this.#spendingLimitsEndpoint.http.get(this.#spendingLimitsEndpoint.endpointPath, {
            params: { ownerId: userId, ownerType: 'INDIVIDUAL', ...params },
        });
    }

    /**
     * Retrieves category ranking (expense distribution).
     * @param {string} userId - User identifier.
     * @param {Object} params - Query parameters.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Category ranking response.
     */
    getCategoryRanking(userId, params) {
        return this.#categoryRankingEndpoint.http.get(this.#categoryRankingEndpoint.endpointPath, {
            params: { ownerId: userId, ownerType: 'INDIVIDUAL', ...params },
        });
    }

    /**
     * Generates a financial report.
     * @param {Object} payload - Report generation payload.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Report response.
     */
    generateReport(payload) {
        return this.#reportsGenerateEndpoint.create(payload);
    }

    /**
     * Retrieves a financial report summary.
     * @param {Object} params - Query parameters.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} Report summary response.
     */
    getReportSummary(params) {
        return this.#reportsSummaryEndpoint.http.get(this.#reportsSummaryEndpoint.endpointPath, { params });
    }
}
