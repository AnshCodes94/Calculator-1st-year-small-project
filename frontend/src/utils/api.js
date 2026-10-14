/**
 * Universal API Client with Automatic Offline Client-Side Engine Fallback
 * Works both when connected to the Python Flask backend and 100% offline on mobile devices (APK / PWA).
 */

import {
  evaluateExpressionClient,
  evaluateCalculusClient,
  evaluateAlgebraClient,
  evaluateMatrixClient,
  evaluateComplexClient,
  evaluatePlotClient,
  evaluateExtrasClient
} from './clientMathEngine';

export const postApi = async (url, payload = {}, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If server returns malformed response, fall back to client engine
      return fallbackToClientEngine(url, payload);
    }

    if (!response.ok || (data && data.success === false)) {
      const errorObj = data && data.error ? data.error : {
        code: `HTTP_${response.status}`,
        message: response.statusText || 'Computation failed.',
        hint: 'Please check your values.'
      };
      throw errorObj;
    }

    return data;

  } catch (err) {
    clearTimeout(timeoutId);

    // If aborted due to timeout or network failure (e.g. phone running without server), fall back to client engine
    if (
      err.name === 'AbortError' || 
      (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) ||
      err.message?.includes('Failed to fetch')
    ) {
      return fallbackToClientEngine(url, payload);
    }

    throw err;
  }
};

/**
 * Executes calculation using the built-in Client-Side Engine
 */
function fallbackToClientEngine(url, payload) {
  try {
    if (url.includes('/api/calculate')) {
      return evaluateExpressionClient(payload.expression, payload.angle_mode || 'rad');
    }
    if (url.includes('/api/calculus')) {
      return evaluateCalculusClient(url, payload);
    }
    if (url.includes('/api/algebra')) {
      return evaluateAlgebraClient(url, payload);
    }
    if (url.includes('/api/matrix')) {
      return evaluateMatrixClient(url, payload);
    }
    if (url.includes('/api/complex')) {
      return evaluateComplexClient(payload);
    }
    if (url.includes('/api/plot')) {
      return evaluatePlotClient(payload);
    }
    if (url.includes('/api/extras')) {
      return evaluateExtrasClient(url, payload);
    }
  } catch (clientErr) {
    throw clientErr;
  }

  throw {
    code: 'OFFLINE_UNSUPPORTED',
    message: 'Operation requires active computational connection.',
    hint: 'Please check expression format.'
  };
}
