import { useState, useRef, useEffect } from "react";
import ApolloClient from 'apollo-boost';
import { apiUrl } from "../data/apiData";
import buildGraphQlQuery from '../data/graphQlHelper';

export default function useGraphQl(slug, roomSlug) {
  const isMountedRef = useRef(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    async function init() {
      try {
        const client = new ApolloClient({ uri: apiUrl + "graphql" });
        const json = await client.query({ query: buildGraphQlQuery(slug, roomSlug) });
          
          if (isMountedRef.current) {
            setData(json.data.establishments[0]);
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
  }, [slug, roomSlug]);

  return { data, error, loading };
}
