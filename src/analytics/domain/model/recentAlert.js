/**
 * Recent financial alert or notification entity.
 * Belongs to the analytics bounded context, domain layer.
 * Alert types: 'budget' | 'milestone' | 'shared'
 *
 * @class RecentAlert
 */
export class RecentAlert {
    /**
     * @param {string} id - Unique identifier.
     * @param {string} type - Alert type: 'budget', 'milestone' or 'shared'.
     * @param {string} titleKey - i18n key for the title.
     * @param {string} descriptionKey - i18n key for the description.
     * @param {string} icon - Tabler icon name.
     * @param {string} color - Hex color for the icon bubble.
     */
    constructor(id, type, titleKey, descriptionKey, icon, color) {
        this.id = id;
        this.type = type;
        this.titleKey = titleKey;
        this.descriptionKey = descriptionKey;
        this.icon = icon;
        this.color = color;
    }
}
