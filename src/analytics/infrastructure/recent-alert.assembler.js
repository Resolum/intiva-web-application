import { RecentAlert } from '@/analytics/domain/model/recentAlert.js'

function limitColor(status) {
  if (status === 'EXCEEDED') return '#D85A30'
  if (status === 'WARNING')  return '#EF9F27'
  return '#1D9E75'
}

/**
 * Maps Analytics infrastructure resources into {@link RecentAlert} domain entities.
 * Belongs to the infrastructure layer of the Analytics bounded context.
 *
 * @class RecentAlertAssembler
 */
export class RecentAlertAssembler {
  /**
   * Converts a raw resource into a RecentAlert entity.
   * @param {Object} resource - Resource payload with id, type, titleKey, descriptionKey, icon, color.
   * @returns {RecentAlert} Mapped recent alert entity.
   */
  static toEntityFromResource(resource) {
    return new RecentAlert(resource.id, resource.type, resource.titleKey, resource.descriptionKey, resource.icon, resource.color)
  }

  /**
   * Parses an HTTP response containing recent alert resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {RecentAlert[]} Collection of recent alert entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.alerts ?? []
    return list.map(item => RecentAlertAssembler.toEntityFromResource(item))
  }

  /**
   * Builds recent alert entities from the spending-limits API data.
   * Filters out limits with WARNING or EXCEEDED status.
   * @param {Object} spendingLimits - Spending limits payload with details array.
   * @returns {RecentAlert[]} Recent alert entities.
   */
  static buildFromSpendingLimits(spendingLimits) {
    const details = spendingLimits.details ?? []
    return details
      .filter(d => d.status === 'WARNING' || d.status === 'EXCEEDED')
      .map(d =>
        new RecentAlert(
          d.spendingLimitId,
          d.status === 'EXCEEDED' ? 'budget' : 'milestone',
          d.categoryName,
          `${d.usagePercentage}%`,
          'exclamation-circle',
          limitColor(d.status),
        )
      )
  }
}
