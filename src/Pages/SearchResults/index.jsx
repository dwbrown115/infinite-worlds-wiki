import React, { useEffect, useState } from "react";
import algoliasearch from "algoliasearch";
import { Link, useNavigate } from "react-router-dom";

import { ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY } from "../../../config";
import { Loading, searchAndBold } from "../../helpers";
import { Content } from "../../components";

function SearchResults() {
  const router = useNavigate();

  const [query, setQuery] = useState(
    window.location.href.split("search_results/")[1].replace(/%20/g, " ")
  );
  const [queryForm, setQueryForm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const search = (query) => {
    var client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY);
    var index = client.initIndex("vite-firebase-content");
    try {
      index.search(query).then(function (responses) {
        const resultsArray = [];
        resultsArray.push(...responses.hits);
        // console.log(resultsArray);
        setResults(resultsArray);
        setIsLoading(false);
        // console.log(results.length);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryUrl = queryForm.replace(/\+/g, " ");
    setQuery(queryUrl);
    router(`/search_results/${queryUrl}`);
  };

  const handleTest = () => {
    const word = "wolf";
    const number = 3;
    const text = `He is also a wolfbrother, and has exceptional skills in manipulating.`;
    let output = findWord(text, "wolf", 2);
    console.log(output);
  };

  useEffect(() => {
    // console.log(query);
    search(query);
    // console.log(url);
  }, [query]);

  const handlePageContent = () => {
    return (
      <>
        <br />
        <br />
        <form onSubmit={handleSubmit} id="search-books">
          <label typeof="text">Looking for something else? </label>
          <input
            type="search"
            id="searchBooks"
            className="search-books-input"
            // value={query}
            onChange={(e) => setQueryForm(e.target.value.toString())}
          />
          <input type="submit" />
        </form>
        <h2>Search results for:</h2>
        <h3>{query}</h3>
        {/* <button onClick={handleTest}>Test</button> */}
        {/* <div>{JSON.stringify(results)}</div> */}
        <div>
          {results.length != 0 ? (
            <div>
              {results.map((item, key) => {
                // console.log(item.text);
                const text = item.text;
                // console.log(text);
                // console.log(findWord(text, query, 4, 8));
                return (
                  <Content
                    key={key}
                    id={item.title.split(" ")}
                    title={item.title}
                    text={searchAndBold(text, query, 5, 10)}
                    // text={text}
                    admin={false}
                    search={true}
                  />
                );
              })}
            </div>
          ) : (
            <div>No results found!</div>
          )}
        </div>
        <Link to={"/"}>Home</Link>
      </>
    );
  };
  return (
    <>
      <Loading isLoading={isLoading} component={handlePageContent()} />
    </>
  );
}

export default SearchResults;
