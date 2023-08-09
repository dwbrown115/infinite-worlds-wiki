import { useEffect, useState } from "react";
import algoliasearch from "algoliasearch";
import { Link, useNavigate } from "react-router-dom";

import { ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY } from "../../../config";
import { Loading, searchAndBold, replacePartOfAString } from "../../helpers";
import { Content } from "../../components";

function SearchResults() {
    const router = useNavigate();

    const [query, setQuery] = useState(
        window.location.href.split("search_results/")[1].replace("%20", " ")
    );
    const [queryForm, setQueryForm] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const search = (query) => {
        var client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_KEY);
        var index = client.initIndex("InfiniteWorldsWiki");
        try {
            index.search(query).then(function (responses) {
                const resultsArray = [];
                resultsArray.push(...responses.hits);
                // console.log(resultsArray);
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

    useEffect(() => {
        // console.log(query);
        search(query);
        // console.log(query);
        // console.log(url);
    }, [query]);

    const handlePageContent = () => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <br />
                <br />
                <form onSubmit={handleSubmit} id="search-books">
                    <label type="text">Looking for something else? </label>
                    <input
                        type="search"
                        id="searchBooks"
                        className="search-books-input"
                        // value={query}
                        onChange={(e) =>
                            setQueryForm(e.target.value.toString())
                        }
                    />
                    <input type="submit" />
                </form>
                <h2>Search results for:</h2>
                <div>{query}</div>
                {/* <button onClick={handleTest}>Test</button> */}
                {/* <div>{JSON.stringify(results)}</div> */}
                <div>
                    {results?.length != 0 ? (
                        <div>
                            {results?.map((item, key) => {
                                // console.log(item.id);
                                const id = replacePartOfAString(
                                    item.Name,
                                    " ",
                                    ","
                                );
                                // console.log(item.Series);
                                // console.log(item.text);
                                // const text = item.text;
                                // console.log(text);
                                // console.log(findWord(text, query, 4, 8));
                                return (
                                    <div style={{ margin: "10px" }} key={key}>
                                        <div>Type: {item.Type}</div>
                                        <div>Series: {item.Series}</div>
                                        <div>
                                            Name:{" "}
                                            <Link
                                                to={`/${replacePartOfAString(
                                                    item.Type,
                                                    " ",
                                                    ""
                                                )}/${id}`}
                                            >
                                                {item.Name}
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div>No results found!</div>
                    )}
                </div>
                <Link to={"/"}>Home</Link>
            </div>
        );
    };
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <Loading isLoading={isLoading} component={handlePageContent()} />
        </div>
    );
}

export default SearchResults;
