/**
 * IAM user aggregate root representation used by the client domain model.
 *
 * @class User
 */
export class User {
    /**
     * @param {Object} params - Entity attributes.
     * @param {string|number} params.id - Unique user identifier.
     * @param {string} params.email - User email address.
     */
    constructor({ id, email }) {
        this.id = id;
        this.email = email;
    }
}
