import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
    const router = useNavigate();

    // const [searchFor, setSearchFor] = useState("");
    const [searchForm, setSearchForm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryUrl = searchForm.replace(/\+/g, " ");
        // setSearchFor(queryUrl);
        router(`/search_results/${queryUrl}`);
        router(0);
    };
    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <form onSubmit={handleSubmit} id="search-books">
                <label type="text">Search: </label>
                <input
                    type="search"
                    id="searchBooks"
                    className="search-books-input"
                    onChange={(e) => setSearchForm(e.target.value.toString())}
                />
                <input type="submit" />
            </form>
        </div>
    );
}

export default SearchBar;
