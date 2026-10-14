/**
 * Async API fetch client with timeout, structured error parsing and offline resilience.
 */

export const postApi = async (url, payload = {}, timeoutMs = 12000) => {
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
      throw {
        code: 'PARSE_ERROR',
        message: 'Could not parse response from mathematical engine.',
        hint: 'Please check your inputs and try again.'
      };
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

    if (err.name === 'AbortError') {
      throw {
        code: 'TIMEOUT_ERROR',
        message: 'The computation exceeded the maximum time limit (12s).',
        hint: 'SymPy took too long. Try a simpler expression or reduce series order.'
      };
    }

    // Network / Backend Unreachable
    if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
      throw {
        code: 'NETWORK_FAILURE',
        message: 'Cannot connect to the Flask/SymPy backend service.',
        hint: 'Ensure Python Flask is running (python run.py) on http://127.0.0.1:5000.'
      };
    }

    throw err;
  }
};
