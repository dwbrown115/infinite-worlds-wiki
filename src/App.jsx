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
  ResetPassword,
} from "./Pages";
import { Searchbar } from "./components";
import "./App.scss";

function App() {
  const test = "test";
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
          <Route path="/auth/reset-password" Component={ResetPassword} />
          <Route path="/user/edit/:id" Component={ContentEdit} />
          <Route path="/content/:id" Component={ContentId} />
          <Route path="/signin" Component={SignIn} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/search_results/:id" Component={SearchResults} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
