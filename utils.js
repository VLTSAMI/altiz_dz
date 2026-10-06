/**
 * Altiz Solutions DZ - Shared Utilities
 * Version: 3.2
 */

/**
 * Escapes HTML characters to prevent XSS injection.
 * @param {string|number} text
 * @returns {string}
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Normalizes Google Drive sharing links to direct embed/thumbnail endpoints.
 * @param {string} url
 * @param {'image'|'video'|'preview'} type
 * @returns {string}
 */
function fixDriveUrl(url, type = 'image') {
    if (!url) return '';
    if (typeof url !== 'string') return url;

    if (url.includes('drive.google.com')) {
        let id = '';
        if (url.includes('/d/')) {
            id = url.split('/d/')[1]?.split('/')[0];
        } else if (url.includes('id=')) {
            id = url.split('id=')[1]?.split('&')[0];
        }

        if (!id) return url;

        if (type === 'video') {
            return `https://docs.google.com/uc?export=download&id=${id}`;
        }
        if (type === 'preview') {
            return `https://drive.google.com/file/d/${id}/view`;
        }

        // Official Google Drive thumbnail endpoint
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }

    return url;
}
