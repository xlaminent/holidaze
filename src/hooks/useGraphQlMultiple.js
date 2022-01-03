import { useState, useRef, useEffect } from "react";
import { apiUrl } from "../data/apiData";
import ApolloClient from 'apollo-boost';
import buildGraphQlQuery from '../data/graphQlHelper';

export default function useGraphQlMultiple(slugs) {
    const previousSlugs = useRef([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      // Only run if the array of slugs have changed
        if (slugs.length === 0) {
            setLoading(false);
            setData([]);
            return;
        } else if (areEqual(previousSlugs.current, slugs)) {
            setLoading(false);
            return;
        }
      
      previousSlugs.current = slugs;

      const client = new ApolloClient({ uri: apiUrl + "graphql" });
      const roomPromises = slugs.map(slug => client.query({ query: buildGraphQlQuery(slug.accommodationSlug, slug.roomSlug) }));

      Promise.all(roomPromises)
          .then((roomResponses) => {
              setData(roomResponses.map(room => room.data.establishments[0]));
          })
          .catch((e) => {
                setError(e);
          })
          .finally(() => setLoading(false));
        // eslint-disable-next-line
    }, []);

    return { data, loading, error };
}

function areEqual(slugList, slugList2) {
    return (
        slugList.length === slugList2.length &&
        slugList.every((value, i) => value === slugList2[i])
    );
}

