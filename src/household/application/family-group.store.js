import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { HouseholdApi } from '@/household/infrastructure/household-api.js'
import { FamilyGroupAssembler } from '@/household/infrastructure/family-group.assembler.js'
import { FamilyMemberAssembler } from '@/household/infrastructure/family-member.assembler.js'

const householdApi = new HouseholdApi()

/**
 * Application service store for the Household bounded context.
 * Coordinates family group use cases (load, discover, create, assign role)
 * via the HouseholdApi and exposes UI-facing state.
 *
 * @returns {Object} Store state and actions.
 */
export const useFamilyGroupStore = defineStore('family-group', () => {
  /**
   * Currently loaded family group, or null when none is loaded.
   * @type {import('vue').Ref<import('@/household/domain/model/family-group.js').FamilyGroup|null>}
   */
  const group     = ref(null)
  /**
   * Members of the currently loaded family group.
   * @type {import('vue').Ref<Array<import('@/household/domain/model/family-member.js').FamilyMember>>}
   */
  const members   = ref([])
  /**
   * Whether a family group operation is in progress.
   * @type {import('vue').Ref<boolean>}
   */
  const isLoading = ref(false)
  /**
   * Last error encountered during a family group operation.
   * @type {import('vue').Ref<Error|null>}
   */
  const error     = ref(null)

  /**
   * Whether a family group is currently loaded.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const hasGroup = computed(() => group.value !== null)

  /**
   * Loads a family group by ID and its members.
   * @param {string} userId - User identifier.
   * @param {string|number} familyId - Family group identifier.
   * @returns {Promise<void>}
   */
  async function loadGroup(userId, familyId) {
    if (!userId) return
    isLoading.value = true
    error.value = null
    try {
      const [groupResponse, membersResponse] = await Promise.all([
        householdApi.getGroupFamilyById(userId, familyId),
        householdApi.getFamilyMembers(userId, familyId),
      ])
      group.value   = FamilyGroupAssembler.toGroup(groupResponse.data)
      const rawMembers = Array.isArray(membersResponse.data)
        ? membersResponse.data
        : (membersResponse.data?.members ?? membersResponse.data?.content ?? [])
      members.value = FamilyMemberAssembler.toMemberList(rawMembers)
    } catch (err) {
      error.value = err
      console.warn('[FamilyGroupStore] loadGroup failed:', err.message)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Discovers the family group for the given user and loads it.
   * Strategy: check invitations for accepted ones, then probe recent group IDs.
   * @param {string} userId - User identifier.
   * @returns {Promise<void>}
   */
  async function discoverAndLoad(userId) {
    if (!userId || hasGroup.value) return

    isLoading.value = true
    error.value = null
    try {
      // Strategy 1: check invitations for accepted ones
      let discovered = null
      try {
        const invResponse = await householdApi.getInvitations(userId)
        const invData = invResponse.data
        const list = Array.isArray(invData) ? invData : (invData?.content ?? invData?.items ?? [])
        const accepted = list.find(
          inv => (inv.status === 'ACCEPTED' || inv.status === 'accepted') &&
                 (inv.familyId ?? inv.groupId ?? inv.family?.id)
        )
        if (accepted) {
          discovered = String(accepted.familyId ?? accepted.groupId ?? accepted.family?.id)
        }
      } catch {
        // invitations endpoint failed — continue to next strategy
      }

      // Strategy 2: probe recent group IDs (1-20) looking for one owned by this user
      if (!discovered) {
        const probeLimit = 20
        for (let id = 1; id <= probeLimit; id++) {
          try {
            const response = await householdApi.getGroupFamilyById(userId, id)
            if (response.data && String(response.data.ownerId) === String(userId)) {
              discovered = String(response.data.id)
              break
            }
          } catch {
            // 404 or 403 — not this group, continue
          }
        }
      }

      if (discovered) {
        await loadGroup(userId, discovered)
      }
    } catch (err) {
      error.value = err
      console.warn('[FamilyGroupStore] discoverAndLoad failed:', err.message)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Creates a new family group.
   * @param {string} userId - User identifier.
   * @param {Object} payload - Group creation payload.
   * @returns {Promise<void>}
   */
  async function createGroup(userId, payload) {
    if (!userId) return
    isLoading.value = true
    error.value = null
    try {
      const response = await householdApi.createGroupFamily(userId, payload)
      group.value   = FamilyGroupAssembler.toGroup(response.data)
      members.value = []
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Assigns a role to a family member.
   * @param {string} userId - User identifier.
   * @param {string|number} memberId - Member identifier.
   * @param {string} role - Role to assign.
   * @returns {Promise<void>}
   */
  async function assignRole(userId, memberId, role) {
    if (!userId || !group.value?.id) return
    await householdApi.assignMemberRole(userId, group.value.id, memberId, role)
    const member = members.value.find(m => m.id === memberId)
    if (member) member.role = role
  }

  /** Resets all family group state. */
  function reset() {
    group.value   = null
    members.value = []
    error.value   = null
  }

  return {
    group, members, isLoading, error, hasGroup,
    loadGroup, discoverAndLoad, createGroup, assignRole, reset,
  }
})
