import { FamilyMember } from '@/household/domain/model/family-member.js'

/**
 * Maps Household infrastructure resources into {@link FamilyMember} domain entities.
 * Belongs to the infrastructure layer of the Household bounded context.
 *
 * @class FamilyMemberAssembler
 */
export class FamilyMemberAssembler {
  /**
   * Converts a raw resource into a FamilyMember entity.
   * @param {Object} resource - Resource payload.
   * @returns {FamilyMember} Mapped family member entity.
   */
  static toEntityFromResource(resource) {
    return new FamilyMember(resource)
  }

  /**
   * Parses an HTTP response containing family member resources.
   * @param {import('axios').AxiosResponse<Object>} response - HTTP response.
   * @returns {FamilyMember[]} Collection of family member entities.
   */
  static toEntitiesFromResponse(response) {
    const data = response?.data
    if (!data) return []
    const list = Array.isArray(data) ? data : data.members ?? data.content ?? []
    return list.map(item => FamilyMemberAssembler.toEntityFromResource(item))
  }

  /**
   * Converts a raw list of API responses into FamilyMember entities.
   * @param {Object[]} rawList - Array of API response objects.
   * @returns {FamilyMember[]} Collection of mapped family member entities.
   */
  static toMemberList(rawList) {
    console.log('[FamilyMemberAssembler] toMemberList input:', rawList)
    return (Array.isArray(rawList) ? rawList : []).map(m => {
      console.log('[FamilyMemberAssembler] raw member:', m)
      return new FamilyMember(m)
    })
  }
}
