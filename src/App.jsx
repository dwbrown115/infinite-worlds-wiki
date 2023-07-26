import React from "react";
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
  ItemPageTemplate,
  LocationPageTemplate,
  PowerSystemPageTemplate,
  RacePageTemplate,
  EditBookPage,
  EditCharacterInfo,
  EditCharacterRelationships,
  EditCharacterSynopsis,
  EditEventPage,
  EditItemPage,
  EditLocationPage,
  EditPowerSystemPage,
  EditRacePage,
  BookPage,
  CharacterInfo,
  CharacterRelationships,
  CharacterSynopsis,
  EventPage,
  ItemPage,
  LocationPage,
  PowerSystemPage,
  RacePage,
} from "./Pages";
import { Searchbar } from "./components";
import "./App.scss";

function App() {
  return (
    <>
      <Router>
        <Searchbar />
        <Routes>
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
          <Route path="/auth/reset-password" Component={NewPassword} />
          <Route path="/user/edit/EditBookPage/:id" Component={EditBookPage} />
          <Route
            path="/user/edit/:id?/EditCharacterInfo"
            Component={EditCharacterInfo}
          />
          <Route
            path="/user/edit/:id?/EditCharacterRelationships"
            Component={EditCharacterRelationships}
          />
          <Route
            path="/user/edit/:id?/EditCharacterSynopsis"
            Component={EditCharacterSynopsis}
          />
          <Route
            path="/user/edit/EditEventPage/:id"
            Component={EditEventPage}
          />
          <Route path="/user/edit/EditItemPage/:id" Component={EditItemPage} />
          <Route
            path="/user/edit/EditLocationPage/:id"
            Component={EditLocationPage}
          />
          <Route
            path="/user/edit/EditPowerSystemPage/:id"
            Component={EditPowerSystemPage}
          />
          <Route path="/user/edit/EditRacePage/:id" Component={EditRacePage} />

          <Route path="/Book/:id" Component={BookPage} />
          <Route path="/Character/:id" Component={CharacterInfo} />
          <Route
            path="/Character/:id?/Synopsis"
            Component={CharacterSynopsis}
          />
          <Route
            path="/Character/:id?/Relationships"
            Component={CharacterRelationships}
          />
          <Route path="/Event/:id" Component={EventPage} />
          <Route path="/Item/:id" Component={ItemPage} />
          <Route path="/Location/:id" Component={LocationPage} />
          <Route path="/PowerSystem/:id" Component={PowerSystemPage} />
          <Route path="/Race/:id" Component={RacePage} />
          <Route path="/signin" Component={SignIn} />
          <Route path="/signin/forgot-password" Component={ForgotPassword} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/search_results/:id" Component={SearchResults} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
