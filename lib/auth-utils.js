/**
 * Utility to decode the admin JWT cookie payload strictly on the client side.
 * Warning: Do not use this for true security checks; always verify signatures heavily on the server (like in middleware.js).
 * This is merely for UI conveniences (e.g. hiding links).
 */
export function getAdminClientSession(tokenString) {
    if (!tokenString) return null;
    try {
        const payloadBase64 = tokenString.split('.')[0];
        const payloadStr = atob(payloadBase64);
        return JSON.parse(payloadStr);
    } catch (e) {
        console.error("Failed to parse admin token on client", e);
        return null;
    }
}
