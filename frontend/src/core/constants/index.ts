/**
 * @index CoreConstants
 * @summary Global application constants
 */

export const APP_NAME = 'TODO List';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/security/login',
    REGISTER: '/security/register',
    LOGOUT: '/security/logout',
  },
} as const;
