import { FamilyGroup } from '@/household/domain/model/family-group.js'

/**
 * Maps Household infrastructure resources into {@link FamilyGroup} domain entities.
 * Belongs to the infrastructure layer of the Household bounded context.
 *
 * @class FamilyGroupAssembler
 */
export class FamilyGroupAssembler {
  /**
   * Converts a raw resource into a FamilyGroup entity.
   * @param {Object} resource - Resource payload.
   * @returns {FamilyGroup} Mapped family group entity.
   */
  static toEntityFromResource(resource) {
    return new FamilyGroup(resource)
  }

  /**
   * Parses an HTTP response containing family group resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {FamilyGroup[]} Collection of family group entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.groups ?? data.familyGroups ?? []
    return list.map(item => FamilyGroupAssembler.toEntityFromResource(item))
  }

  /**
   * Converts a raw group response into a single FamilyGroup entity.
   * @param {Object} raw - Raw API response object.
   * @returns {FamilyGroup} Mapped family group entity.
   */
  static toGroup(raw) {
    return new FamilyGroup(raw)
  }
}
