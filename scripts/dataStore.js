/**
 * Data Store:
 * -----------
 * A simple way to fetch, store, and share JSON data between components. If components are
 * requesting the same data, they will use the same shared data instead of repeating requests.
 * 
 * After a fetch request, the response is stored in the `dataCache`. Subsequent calls to the
 * same endpoint will return this already retrieved data.
 * 
 * If two or more requests to the same endpoint are made in succession, and the first hasn't
 * finished, the original request (stored in `currentRequests`) will be returned instead.
 * This helps to avoid hitting the same endpoint multiple times in a row.
 *
 * Example usage:
 *  import { dataStore } from './dataStore.js';
 *  const articles = await dataStore.getData('/api/articles');
 */

/**
 * Cache of fetched data per endpoint.
 * Sets key names equal to the endpoint with a value of the response.json().
 */
const dataCache = new Map();

/**
 * Promises for ongoing requests, stored per endpoint. Sets key names equal to the endpoint.
 */
const currentRequests = new Map();

/**
 * Commonly used endpoints for the project.
 */
const commonEndpoints = {
  queryIndex: '/query-index.json',
};

/**
 * Fetch JSON data from an endpoint, and stores it in the cache on success.
 * Removes request from `currentRequests` when complete.
 * 
 * @param {string} endpoint
 * @returns {object|null} Data from response.json(). On error, returns null.
 */
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error - status: "${response.status}" for endpoint "${endpoint}".`);
    }
    const data = await response.json();

    // Succcess: store data in cache and clear from current requests.
    dataCache.set(endpoint, data);
    currentRequests.delete(endpoint);
    return data;
  } catch (error) {
    // Error: log error and clear from current requests.
    console.error(`Error fetching data from endpoint "${endpoint}":`, error);
    currentRequests.delete(endpoint);
    return null;
  }
};

/**
 * Fetch JSON data from an endpoint or return already fetched data from the cache.
 * - If returned data exists in cache, return it.
 * - If there is a current request for the same endpoint, return that.
 * - If it's a new request, make the fetch.
 * 
 * @param {string} endpoint
 * @returns {Promise} Always returns a promise, either resolved with data or an in progress request.
 */
const getData = async (endpoint) => {
  // Data was already fetched, so return the existing data from the cache, in the form of a resolved promise.
  if (dataCache.has(endpoint)) {
    return Promise.resolve(dataCache.get(endpoint));
  }

  // If a request to this endpoint is already in progress, return that promise.
  if (currentRequests.has(endpoint)) {
    return currentRequests.get(endpoint); 
  }

  // Make a new request. Fetch data and parse as JSON.
  const newRequest = fetchData(endpoint);
  currentRequests.set(endpoint, newRequest);
  return Promise.resolve(await newRequest);
}

export const dataStore = {
  getData,
  commonEndpoints,
  getAllStoreDataDebug: () => {
    return {
      dataCache,
      currentRequests,
    }
  }
};