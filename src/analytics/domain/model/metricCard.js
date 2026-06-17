/**
 * KPI metric card entity shown on the dashboard.
 * Belongs to the analytics bounded context, domain layer.
 *
 * @class MetricCard
 */
export class MetricCard {
    /**
     * @param {string} labelKey - i18n key, e.g. 'dashboard.totalBalance'.
     * @param {number} value - Numeric value in PEN.
     * @param {number} trend - Percentage change vs previous period (positive = up).
     * @param {string} icon - Tabler icon name, e.g. 'wallet'.
     */
    constructor(labelKey, value, trend, icon) {
        this.labelKey = labelKey;
        this.value = value;
        this.trend = trend;
        this.icon = icon;
    }
}
