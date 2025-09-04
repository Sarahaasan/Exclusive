// useFetch.js
import { useState, useEffect } from "react";
import { fetchAPI } from "./FetchAPI.js"; 

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchAPI(url, options);

      if (isMounted) {
        if (result) {
          setData(result);
        } else {
          setError(new Error("No data returned"));
        }
        setLoading(false);
      }
    };

    getData();

    return () => {
      isMounted = false; 
    };
  }, [url, JSON.stringify(options)]); // stringify options so effect re-runs correctly

  return { data, loading, error };
};
