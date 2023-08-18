import React, { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { HitComponent } from "./HitComponent";

export const SearchListsComponent = (props) => {
  const [searchClient, setSearchClient] = useState();

  useEffect(() => {
    if (process.env.REACT_APP_ALGOLIA_APP_ID && props.searchSecureKey) {
      const client = algoliasearch(
        process.env.REACT_APP_ALGOLIA_APP_ID,
        props.searchSecureKey
      );

      setSearchClient(client);
    }
  }, [props.searchSecureKey]);

  return (
    <>
      {searchClient && (
        <InstantSearch
          searchClient={searchClient}
          indexName={`${process.env.NODE_ENV}-lists`}
        >
          <SearchBox placeholder="search for lists" />
          <Hits hitComponent={HitComponent} />
        </InstantSearch>
      )}
      {!searchClient && (
        <center>
          <h5>Algolia not configured</h5>
        </center>
      )}
    </>
  );
};
