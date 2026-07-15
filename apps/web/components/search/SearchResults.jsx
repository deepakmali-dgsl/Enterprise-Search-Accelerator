"use client";

import { Hits } from "react-instantsearch";
import VisaCard from "./VisaCard";

function Hit({ hit }) {
  return <VisaCard hit={hit} />;
}

export default function SearchResults() {
  return <Hits hitComponent={Hit} />;
}