import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
    Home,
    UserDashboard,
    ContentDashboard,
    ContentUpload,
    SignIn,
    SignUp,
    SearchResults,
    IsAuth,
    NewPassword,
    ForgotPassword,
    BookPageTemplate,
    CharacterPageTemplate,
    EventPageTemplate,
    FactionPageTemplate,
    ItemPageTemplate,
    LocationPageTemplate,
    PowerSystemPageTemplate,
    RacePageTemplate,
    EditBookPage,
    EditCharacterInfo,
    EditCharacterRelationships,
    EditCharacterSynopsis,
    EditEventPage,
    EditFactionPage,
    EditItemPage,
    EditLocationPage,
    EditPowerSystemPage,
    EditRacePage,
    BookPage,
    CharacterInfo,
    CharacterRelationships,
    CharacterSynopsis,
    EventPage,
    FactionPage,
    ItemPage,
    LocationPage,
    PowerSystemPage,
    RacePage,
} from "./Pages";
import { Searchbar, Sidebar, Footer } from "./components";
import "./App.scss";

function App() {
    return (
        <div>
            <Router>
                <div className="PageWrapper">
                    <div className="SidebarWrapper">
                        <Searchbar />
                        <Sidebar />
                    </div>
                    <Routes className="Routes">
                        <Route path="/" Component={Home} />
                        <Route path="/user" Component={UserDashboard} />
                        <Route path="/user/authentication" Component={IsAuth} />
                        <Route path="/content" Component={ContentDashboard} />
                        <Route path="/user/upload" Component={ContentUpload} />
                        <Route
                            path="/user/upload/BookPageTemplate"
                            Component={BookPageTemplate}
                        />
                        <Route
                            path="/user/upload/CharacterPageTemplate"
                            Component={CharacterPageTemplate}
                        />
                        <Route
                            path="/user/upload/EventPageTemplate"
                            Component={EventPageTemplate}
                        />
                        <Route
                            path="/user/upload/FactionPageTemplate"
                            Component={FactionPageTemplate}
                        />
                        <Route
                            path="/user/upload/ItemPageTemplate"
                            Component={ItemPageTemplate}
                        />
                        <Route
                            path="/user/upload/LocationPageTemplate"
                            Component={LocationPageTemplate}
                        />
                        <Route
                            path="/user/upload/PowerSystemPageTemplate"
                            Component={PowerSystemPageTemplate}
                        />
                        <Route
                            path="/user/upload/RacePageTemplate"
                            Component={RacePageTemplate}
                        />
                        <Route
                            path="/auth/reset-password"
                            Component={NewPassword}
                        />
                        <Route
                            path="/EditBookPage/:id"
                            Component={EditBookPage}
                        />
                        <Route
                            path="/EditCharacterInfo/:id"
                            Component={EditCharacterInfo}
                        />
                        <Route
                            path="/EditCharacterRelationships/:id"
                            Component={EditCharacterRelationships}
                        />
                        <Route
                            path="/EditCharacterSynopsis/:id"
                            Component={EditCharacterSynopsis}
                        />
                        <Route
                            path="/EditEventPage/:id"
                            Component={EditEventPage}
                        />
                        <Route
                            path="/EditFactionPage/:id"
                            Component={EditFactionPage}
                        />
                        <Route
                            path="/EditItemPage/:id"
                            Component={EditItemPage}
                        />
                        <Route
                            path="/EditLocationPage/:id"
                            Component={EditLocationPage}
                        />
                        <Route
                            path="/EditPowerSystemPage/:id"
                            Component={EditPowerSystemPage}
                        />
                        <Route
                            path="/EditRacePage/:id"
                            Component={EditRacePage}
                        />
                        <Route path="/Book/:id" Component={BookPage} />
                        <Route
                            path="/Character/:id"
                            Component={CharacterInfo}
                        />
                        <Route
                            path="/Character/:id?/Synopsis"
                            Component={CharacterSynopsis}
                        />
                        <Route
                            path="/Character/:id?/Relationships"
                            Component={CharacterRelationships}
                        />
                        <Route path="/Event/:id" Component={EventPage} />
                        <Route path="/Faction/:id" Component={FactionPage} />
                        <Route path="/Item/:id" Component={ItemPage} />
                        <Route path="/Location/:id" Component={LocationPage} />
                        <Route
                            path="/PowerSystem/:id"
                            Component={PowerSystemPage}
                        />
                        <Route path="/Race/:id" Component={RacePage} />
                        <Route path="/login" Component={SignIn} />
                        <Route
                            path="/login/forgot-password"
                            Component={ForgotPassword}
                        />
                        <Route path="/signup" Component={SignUp} />
                        <Route
                            path="/search_results/:id"
                            Component={SearchResults}
                        />
                    </Routes>
                </div>
                <div>
                    <Footer />
                </div>
            </Router>
        </div>
    );
}
export default App;
