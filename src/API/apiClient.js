// src/API/apiClient.js
import axios from 'axios';
import * as Endpoints from '../Entities/Endpoint';
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearToken,
    getTokenExpiry,
} from '../utils/tokenManager';
import { store } from '../Redux';
import { AuthActions } from '../Redux/AuthRedux';

const apiClient = axios.create({
    baseURL: Endpoints.BASE_ENDPOINT,
    headers: {
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// refresh control
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const refreshTokenFlow = async () => {
    // Sync state from Redux store first
    const state = store.getState();
    const storedRefreshToken = state.auth.refreshToken || getRefreshToken();

    if (!storedRefreshToken) {
        throw new Error('No refresh token available');
    }

    // Use a plain axios instance to call refresh endpoint to avoid interceptors loops
    // User confirmed refreshToken should be sent as Params
    const response = await axios.post(
        Endpoints.BASE_ENDPOINT + Endpoints.REFRESH_TOKEN,
        null, // No body
        {
            params: { refreshToken: storedRefreshToken },
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Accept-Language': 'en-US',
            },
        }
    );

    if (!response?.data || response.data.loginStatus !== 'Valid' || !response.data.accessToken) {
        throw new Error('Invalid refresh token response');
    }

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken || storedRefreshToken;
    const tokenExpiry = response.data.tokenExpiry || null;

    // update in-memory
    setTokens(newAccessToken, newRefreshToken, tokenExpiry);

    // update Redux (which handles persistence)
    store.dispatch(AuthActions.updateTokens(newAccessToken, newRefreshToken, tokenExpiry));

    return newAccessToken;
};

// Attach token to requests
apiClient.interceptors.request.use(
    async (config) => {
        try {
            let token = getAccessToken();

            // if no in-memory token, check Redux store (primary source of truth)
            if (!token) {
                const state = store.getState();
                if (state.auth.token) {
                    setTokens(state.auth.token, state.auth.refreshToken, state.auth.tokenExpiry);
                    token = state.auth.token;
                }
            }

            // Proactive short-window refresh:
            // if tokenExpiry exists and expires within 60 seconds, attempt refresh synchronously
            const expiry = getTokenExpiry();
            if (expiry) {
                const expiryTime = new Date(expiry).getTime();
                const now = Date.now();
                const timeLeftMs = expiryTime - now;


                // Only refresh if close to expiry OR already expired
                // Removed the check for -60000 to allow refreshing even if expired long ago
                if (timeLeftMs <= 60 * 1000) {
                    // if already refreshing, we'll proceed and let response interceptor queue
                    if (!isRefreshing) {
                        isRefreshing = true;
                        try {
                            console.log(`Token expired or expiring soon (diff: ${timeLeftMs}ms), refreshing proactively...`);
                            const newToken = await refreshTokenFlow();
                            token = newToken;
                        } catch (err) {
                            console.log('Proactive refresh failed:', err.response?.data || err.message);
                            // If refresh fails here, ensure we clear auth and let the request fail
                            await clearTokenAndPersistClear();
                            throw err;
                        } finally {
                            isRefreshing = false;
                        }
                    }
                }
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            // swallow error here so request can proceed and response interceptor can handle 401,
            // but still log for debugging
            console.log('Request interceptor token error', err?.message || err);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Helper to clear everything auth-related consistently
const clearTokenAndPersistClear = async () => {
    try {
        clearToken(); // clear memory
        store.dispatch(AuthActions.signOut()); // clear redux & persistence
    } catch (e) {
        // ignore
    }
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If there's no response (network error), just forward
        if (!error.response) return Promise.reject(error);

        // Only attempt refresh on 401
        // Add check: if it's the Refresh Token API itself that failed with 401/403, don't retry!
        if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes(Endpoints.REFRESH_TOKEN)) {
            // If a refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            // Start refresh
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshTokenFlow();

                processQueue(null, newToken);

                // attach to original request and retry
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshErr) {
                // failed to refresh -> clear auth and reject queued requests
                await clearTokenAndPersistClear();
                processQueue(refreshErr, null);
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        // non-401 or already retried requests
        return Promise.reject(error);
    }
);

export default apiClient;
