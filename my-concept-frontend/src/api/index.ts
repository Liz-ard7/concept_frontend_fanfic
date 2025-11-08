import axios from 'axios';
import type { ID, FicCategoryDoc, DateSpec, Fic, Version } from './types';

// Base URL for your API backend
// Use environment variable or default to '/api' for proxy in development
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'http://localhost:10000/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for consistent error handling
async function callApi<T, R>(
  conceptName: string,
  actionName: string,
  data: T,
): Promise<R | { error: string }> {
  console.log(`API Call: ${conceptName}/${actionName} with data:`, data);
  try {
    const response = await apiClient.post(`/${conceptName}/${actionName}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // The backend returns { error: "message" } for expected errors
      return error.response.data as { error: string };
    }
    // For unexpected errors, return a generic error message
    console.error(`API Call Error (${conceptName}/${actionName}):`, error);
    return { error: `An unexpected error occurred: ${String(error)}, ${conceptName}/${actionName}` };
  }
}

// --- UserAuthentication Concept API ---
export const UserAuthAPI = {
  async register(username: string, password: string): Promise<{ user: ID } | { error: string }> {
    return callApi('UserAuthentication', 'register', { username, password });
  },

  async authenticate(username: string, password: string): Promise<{ user: ID } | { error: string }> {
    return callApi('UserAuthentication', 'authenticate', { username, password });
  },

  async deleteUser(username: string, password: string): Promise<{ user: ID } | { error: string }> {
    return callApi('UserAuthentication', 'deleteUser', { username, password });
  },
};

// --- Library Concept API ---
export const LibraryAPI = {
  async addUser(user: ID): Promise<{} | { error: string }> {
    return callApi('Library', 'addUser', { user });
  },

  async submitNewFic(
    user: ID,
    ficText: string,
    ficName: string,
    authorTags: string,
    date: DateSpec,
  ): Promise<{ ficId: ID } | { error: string }> {
    return callApi('Library', 'submitNewFic', { user, ficText, ficName, authorTags, date });
  },

  async submitNewVersionOfFanfic(
    user: ID,
    ficText: string,
    authorTags: string,
    versionTitle: string,
    date: DateSpec,
    ficName: string,
  ): Promise<{ versionId: ID } | { error: string }> {
    return callApi('Library', 'submitNewVersionOfFanfic', { user, ficText, authorTags, versionTitle, date, ficName });
  },

  async viewFic(
    user: ID,
    ficName: string,
    versionNumber: number,
  ): Promise<{ fic: Fic } | { error: string }> {
    // Query returns an array, but our spec says it returns { fic: Fic }, so we adapt.
    // The API spec for queries returns an array, but the example given in the prompt for _viewFic returns { fic: Fic }.
    // I will assume the API returns [{ fic: Fic }] for a single result query.
    const result = await callApi<{ user: ID, ficName: string, versionNumber: number }, [{ fic: Fic }] | { error: string }>(
      'Library',
      '_viewFic',
      { user, ficName, versionNumber },
    );

    if ('error' in result) {
      return result;
    }
    // Assuming a single item array for single-result queries
    return result[0];
  },

  async deleteFic(
    user: ID,
    ficName: string,
    versionNumber: number,
  ): Promise<{ ficId: ID } | { error: string }> {
    return callApi('Library', 'deleteFic', { user, ficName, versionNumber });
  },

  async deleteFicsAndUser(user: ID): Promise<{} | { error: string }> {
    return callApi('Library', 'deleteFicsAndUser', { user });
  },

  // async findFicWithDate(
  //   user: ID,
  //   date: DateSpec,
  // ): Promise<[{ fics: Fic[] }] | { error: string }> {
  //   return callApi('Library', '_findFicWithDate', { user, date });
  // },

  async getVersion(
    user: ID,
    versionTitle: string,
  ): Promise<[{ version: Version }] | { error: string }> {
    return callApi('Library', '_getVersion', { user, versionTitle });
  },

  async deleteVersion(
    user: ID,
    ficTitle: string,
  ): Promise<{ versionId: ID } | { error: string }> {
    return callApi('Library', 'deleteVersion', { user, ficTitle });
  },

  async getAllUserVersions(
    user: ID,
  ): Promise<[{ versions: Version[] }] | { error: string }> {
    return callApi('Library', '_getAllUserVersions', { user });
  },
};

// --- Categorizing Concept API ---
export const CategorizingAPI = {
  async categorizeFic(
    ficId: ID,
    ficText: string,
    authorTags: string,
  ): Promise<{ ficId: ID } | { error: string }> {
    return callApi('Categorizing', 'categorizeFic', { ficId, ficText, authorTags });
  },

  async viewFicCategory(
    ficId: ID,
  ): Promise<FicCategoryDoc[] | { error: string }> {
    // Query returns an array of objects
    return callApi('Categorizing', '_viewFicCategory', { ficId });
  },

  async deleteFicCategory(ficId: ID): Promise<{ ficCategoryId: ID } | { error: string }> {
    return callApi('Categorizing', 'deleteFicCategory', { ficId });
  },

  async deleteFicCategories(
    ficIds: ID[],
  ): Promise<{ deletedCount: number } | { error: string }> {
    return callApi('Categorizing', 'deleteFicCategories', { ficIds });
  },

  async getAllFicCategories(): Promise<FicCategoryDoc[] | { error: string }> {
    // Query returns an array of objects, and takes no arguments
    return callApi('Categorizing', '_getAllFicCategories', {});
  },
};
