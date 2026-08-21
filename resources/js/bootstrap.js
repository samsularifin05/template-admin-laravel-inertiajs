import axios from 'axios';
import toast from "react-hot-toast";
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

async function sha256Hex(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

function normalizeRequestUrl(url) {
    if (!url) {
        return "";
    }

    try {
        const parsed = new URL(url, window.location.origin);

        return `${parsed.pathname}${parsed.search}`;
    } catch {
        return url;
    }
}

function isSameOrigin(url) {
    if (!url) {
        return true;
    }

    try {
        const parsed = new URL(url, window.location.origin);

        return parsed.origin === window.location.origin;
    } catch {
        return false;
    }
}

async function createSecurityHeaders(method, url) {
    const hasCryptoSubtle = typeof crypto !== "undefined" && !!crypto.subtle;
    const nonce =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const timestamp = Date.now().toString();
    const normalizedMethod = (method ?? "GET").toUpperCase();
    const normalizedUrl = normalizeRequestUrl(url);

    // CSRF token is included to bind signature to current browser session.
    const csrf =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? "";

    // Body is excluded to avoid serializer mismatch between axios and Inertia form payloads.
    const rawSignature = `${normalizedMethod}|${normalizedUrl}|${timestamp}|${nonce}|${csrf}`;
    const signature = hasCryptoSubtle
        ? await sha256Hex(rawSignature)
        : rawSignature;

    return {
        "X-Timestamp": timestamp,
        "X-Nonce": nonce,
        "X-Signature": signature,
    };
}

window.axios.interceptors.request.use(async (config) => {
    const method = (config.method ?? "get").toUpperCase();
    const url = normalizeRequestUrl(config.url ?? "");

    if (!isSameOrigin(url)) {
        return config;
    }

    const securityHeaders = await createSecurityHeaders(method, url);

    config.headers = config.headers ?? {};
    config.headers["X-Timestamp"] = securityHeaders["X-Timestamp"];
    config.headers["X-Nonce"] = securityHeaders["X-Nonce"];
    config.headers["X-Signature"] = securityHeaders["X-Signature"];

    return config;
});

const originalFetch = window.fetch?.bind(window);

if (originalFetch) {
    window.fetch = async (input, init = {}) => {
        const requestUrl =
            typeof input === "string"
                ? input
                : input instanceof URL
                  ? input.toString()
                  : (input?.url ?? "");
        const method =
            (init.method ??
                (input instanceof Request ? input.method : "GET")) ||
            "GET";

        if (!isSameOrigin(requestUrl)) {
            return originalFetch(input, init);
        }

        const securityHeaders = await createSecurityHeaders(method, requestUrl);
        const mergedHeaders = new Headers(
            input instanceof Request ? input.headers : undefined,
        );

        if (init.headers) {
            new Headers(init.headers).forEach((value, key) => {
                mergedHeaders.set(key, value);
            });
        }

        Object.entries(securityHeaders).forEach(([key, value]) => {
            mergedHeaders.set(key, value);
        });

        return originalFetch(input, {
            ...init,
            headers: mergedHeaders,
        });
    };
}

