import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./Sidebar.scss";
function Sidebar() {
    return (
        <div className="SidebarWrapper">
            <div className="LogoWrapper">
                <Link to={"/"}>
                    <img
                        src="/src/assets/infiniteWorldsWikiLogo.png"
                        alt="Logo"
                        className="Logo"
                    />
                    <h2 className="LogoHeader">Infinite Worlds Wiki</h2>
                </Link>
            </div>
            <div className="TopWrapper">
                <Link to={"/"}>Home</Link>
                <a href="https://discord.gg/SMDsWAMr">Chat</a>
            </div>
            <div className="ListWrapper">
                {/* <Link to={"/content"}>Content Dashboard</Link> */}
                <h3>Categories</h3>
                <ul className="List">
                    <li>
                        <Link to={"/content"}>All</Link>
                    </li>
                    <li>
                        <Link to={"/Content/BookPages"}>Books</Link>
                    </li>
                    <li>
                        <Link to={"/Content/CharacterPagesList"}>
                            Characters
                        </Link>
                    </li>
                    <li>
                        <Link to={"/Content/EventPages"}>Events</Link>
                    </li>
                    <li>
                        <Link to={"/Content/FactionPages"}>Factions</Link>
                    </li>
                    <li>
                        <Link to={"/Content/ItemPages"}>Items</Link>
                    </li>
                    <li>
                        <Link to={"/Content/LocationPages"}>Locations</Link>
                    </li>
                    <li>
                        <Link to={"/Content/PowerSystemPages"}>
                            Power Systems
                        </Link>
                    </li>
                    <li>
                        <Link to={"/Content/RacePages"}>Races</Link>
                    </li>
                </ul>
            </div>
            <div className="ListWrapper">
                <h3>Other</h3>
                <ul className="List">
                    <li>
                        <Link to={"/FeaturesAndBugsPipeline"}>Pipeline</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
