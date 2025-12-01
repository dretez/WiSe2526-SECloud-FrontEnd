"use strict";

/**
 * Ruft die AI-Analyse für einen Shortlink auf.
 * POST /api/analysis/:shortCode/summary
 */
export async function summary(api, shortCode, from, to) {
    const body = {};
    if (from) body.from = from;
    if (to) body.to = to;

    let result = null;

    await api.post(
        `/api/analysis/${encodeURIComponent(shortCode)}/summary`,
        body,
        {
            404: "Analysis not found",
            500: "Internal Server Error",
        },
        async (response) => {
            result = await response.json();
        },
        async (status, error) => {
            // Fehler nach außen geben, damit das Dashboard sie anzeigen kann
            throw new Error(
                error?.message || `Analysis request failed with status ${status}`,
            );
        },
    );

    return result;
}
