/**
 * Family member entity within a family group.
 * Belongs to the household bounded context, domain layer.
 *
 * @class FamilyMember
 */
export class FamilyMember {
    /**
     * @param {Object} params - Entity attributes.
     * @param {string|number} [params.id] - Member identifier.
     * @param {string} [params.name] - Member display name.
     * @param {string} [params.role] - Role within the family group.
     * @param {string} [params.email] - Member email address.
     */
    constructor(params = {}) {
        this.id = params.id ?? null;
        this.userId = params.userId ?? params.user_id ?? null;
        this.name = params.name ?? '';
        this.role = params.role ?? '';
        this.email = params.email ?? '';
    }
}
