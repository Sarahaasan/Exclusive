// fetchAPI.js

export async function fetchAPI(url, options = {}) {
  try {
    // get token from localStorage
    const token = localStorage.getItem("token");
    //  console.log(token)
    // merge headers with Authorization
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // add token if exists
    };

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
