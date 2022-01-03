import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function useAxios(method, url, payload, options) {
  const isMountedRef = useRef(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMountedRef.current = true;
    async function init() {
      try { 
        let response;

        if(method === "post")
        {
            response = await axios.post(url, payload, options);
        } 
        else if (method === "put") {
          response = await axios.put(url, payload, options);
        }
        else {
            response = await axios.get(url, options);
        }
        
        // if (response.status === "OK") {
          if (response.status === 200) {
          if (isMountedRef.current) {
            setData(response.data);
          }
        } else {
          throw response;
        }
      } catch (e) {
        if (isMountedRef.current) {
          setError(e);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }
    init();

    return () => {
      isMountedRef.current = false;
    }
  }, [url]);

  return { data, error, loading };
}
