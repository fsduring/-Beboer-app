import axios from 'axios';

/**
 * Hjælpeinstans til fremtidige backend-kald.
 * Login foregår nu udelukkende i frontend-demoen, så denne klient bruges kun til øvrige API'er når en backend er tilgængelig.
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
});
