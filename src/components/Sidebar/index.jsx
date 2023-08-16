import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import logo from "./infiniteWorldsWikiLogo.png";

// import { logo } from "../../assets";

import "./Sidebar.scss";
function Sidebar() {
    return (
        <div className="SidebarWrapper">
            <div className="LogoWrapper">
                <Link to={"/"}>
                    <div className="logoImageWrapper">
                        <img src={logo} alt="Logo" className="Logo" />
                    </div>
                    <h2 className="LogoHeader">Infinite Worlds Wiki</h2>
                </Link>
            </div>
            <div className="TopWrapper">
                <ul className="List">
                    <li>
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li>
                        <a href="https://discord.gg/SMDsWAMr">Discord</a>
                    </li>
                    <li>
                        <a href="https://sethring.com/">Seth Ring</a>
                    </li>
                </ul>
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
                        <Link to={"/FeaturesAndBugsPipeline"}>
                            Features Pipeline
                        </Link>
                    </li>
                    <li>
                        <Link to={"/ChangeLog"}>Change Log</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
