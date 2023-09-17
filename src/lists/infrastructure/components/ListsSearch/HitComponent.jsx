import React from "react";
import { useHistory } from "react-router-dom";
import { Highlight } from 'react-instantsearch';

export const HitComponent = ({hit}) => {
  let history = useHistory();

  return (
    <article onClick={() => history.push(`/lists/${hit.objectID}`)}>
      <Highlight attribute="name" hit={hit} />
    </article>
  )
}