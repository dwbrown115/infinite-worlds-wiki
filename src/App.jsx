import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  UserDashboard,
  ContentDashboard,
  ContentId,
  ContentUpload,
  ContentEdit,
  SignIn,
  SignUp,
  SearchResults,
  IsAuth,
  NewPassword,
  ForgotPassword,
  ContentSynopsis,
  ContentRelationships,
  BookPageTemplate,
  CharacterPageTemplate,
  EventPageTemplate,
  ItemPageTemplate,
  LocationPageTemplate,
  PowerSystemPageTemplate,
  RacePageTemplate,
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
          <Route path="/user/edit/:id" Component={ContentEdit} />
          <Route path="/content/:id" Component={ContentId} />
          <Route path="/content/:id?/synopsis" Component={ContentSynopsis} />
          <Route
            path="/content/:id?/relationships"
            Component={ContentRelationships}
          />
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
