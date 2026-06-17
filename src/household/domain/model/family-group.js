/**
 * Family group aggregate root entity.
 * Belongs to the household bounded context, domain layer.
 *
 * @class FamilyGroup
 */
export class FamilyGroup {
    /**
     * @param {Object} params - Entity attributes.
     * @param {string|number} [params.id] - Group identifier.
     * @param {string} [params.name] - Group display name.
     * @param {string|number} [params.ownerId] - Identifier of the group owner.
     */
    constructor(params = {}) {
        this.id = params.id ?? null;
        this.name = params.name ?? '';
        this.ownerId = params.ownerId ?? null;
    }
}
