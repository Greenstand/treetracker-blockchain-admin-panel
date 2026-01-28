const AUTH_BASE_URL =
  process.env.REACT_APP_AUTH_API_URL ||
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_VERSION
    ? `${process.env.REACT_APP_API_URL}/api/${process.env.REACT_APP_API_VERSION}`
    : 'http://138.68.4.47:30001/api/v1');

const CAPTURE_BASE_URL =
  process.env.REACT_APP_CAPTURE_API_URL ||
  process.env.REACT_APP_CAPTURE_SERVICE_URL ||
  'http://138.68.4.47:30002';

const TOKEN_BASE_URL =
  process.env.REACT_APP_TOKEN_API_URL ||
  process.env.REACT_APP_TOKEN_SERVICE_URL ||
  'http://138.68.4.47:30004';

const STORAGE_KEYS = {
  accessToken: 'adminAccessToken',
  refreshToken: 'adminRefreshToken',
  user: 'adminUser'
};

const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEYS.accessToken);
};

const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEYS.refreshToken);
};

const setTokens = ({ accessToken, refreshToken }) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  window.localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
};

const clearTokens = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEYS.accessToken);
  window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
};

const setUser = (user) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

const getUser = () => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
};

const clearUser = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEYS.user);
};

const request = async (path, options = {}, baseUrl) => {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = data?.error || data?.message || response.statusText;
    throw new Error(error);
  }
  return data;
};

const api = {
  auth: {
    async loginAdmin(credentials) {
      const response = await request('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }, AUTH_BASE_URL);

      if (response.success && response.data) {
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });
        setUser(response.data.user);
      }

      return response;
    },
    async refreshToken() {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      }, AUTH_BASE_URL);

      if (response.success && response.data) {
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });
      }

      return response;
    },
    async logout() {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          await request('/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ refreshToken })
          }, AUTH_BASE_URL);
        } catch {
          // Ignore server logout errors
        }
      }
      clearTokens();
      clearUser();
    },
    async getUserById(userId) {
      return request(`/auth/admin/users/${userId}`, {}, AUTH_BASE_URL);
    },
    getUser
  },
  captures: {
    async getAll({ page = 1, limit = 50, status, userId } = {}) {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (status) params.set('status', status);
      if (userId) params.set('userId', userId);

      return request(`/api/captures/admin?${params.toString()}`, {}, CAPTURE_BASE_URL);
    },
    async getById(id) {
      return request(`/api/captures/admin/${id}`, {}, CAPTURE_BASE_URL);
    },
    async approve(captureId, approved) {
      return request(`/api/captures/${captureId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ approved })
      }, CAPTURE_BASE_URL);
    }
  },
  tokens: {
    async issue(payload) {
      return request('/api/tokens', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, TOKEN_BASE_URL);
    },
    async getDashboardMetrics() {
      return request('/api/analytics/dashboard', {}, TOKEN_BASE_URL);
    }
  },
  storage: {
    clearTokens,
    clearUser,
    getAccessToken,
    getRefreshToken,
    getUser,
    setTokens,
    setUser
  }
};

export default api;
