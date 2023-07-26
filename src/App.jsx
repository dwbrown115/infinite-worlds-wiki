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
  EditBookBlurb,
  EditBookChapters,
  EditBookManualOfStyle,
  EditBookSynopsis,
  EditCharacterBlurb,
  EditCharacterInfo,
  EditCharacterManualOfStyle,
  EditCharacterRelationships,
  EditCharacterSynopsis,
  EditEventBlurb,
  EditEventImpact,
  EditEventManualOfStyle,
  EditEventSynopsis,
  EditItemBlurb,
  EditItemDescription,
  EditItemManualOfStyle,
  EditItemUses,
  EditLocationBlurb,
  EditLocationCulture,
  EditLocationGeographyAndEcology,
  EditLocationHistory,
  EditLocationManualOfStyle,
  EditPowerSystemBlurb,
  EditPowerSystemInfo,
  EditPowerSystemManualOfStyle,
  EditRaceBlurb,
  EditRaceCharacteristics,
  EditRaceCulture,
  EditRaceHistory,
  EditRaceManualOfStyle,
  BookPage,
  CharacterInfo,
  CharacterRelationships,
  CharacterSynopsis,
  EventPage,
  ItemPage,
  LocationPage,
  PowerSystemPage,
  RacePage
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
          <Route
            path="/user/edit/:id?/EditBookBlurb"
            Component={EditBookBlurb}
          />
          <Route
            path="/user/edit/:id?/EditBookChapters"
            Component={EditBookChapters}
          />
          <Route
            path="/user/edit/:id?/EditBookManualOfStyle"
            Component={EditBookManualOfStyle}
          />
          <Route
            path="/user/edit/:id?/EditBookSynopsis"
            Component={EditBookSynopsis}
          />
          <Route
            path="/user/edit/:id?/EditCharacterBlurb"
            Component={EditCharacterBlurb}
          />
          <Route
            path="/user/edit/:id?/EditCharacterInfo"
            Component={EditCharacterInfo}
          />
          <Route
            path="/user/edit/:id?/EditCharacterManualOfStyle"
            Component={EditCharacterManualOfStyle}
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
            path="/user/edit/:id?/EditEventBlurb"
            Component={EditEventBlurb}
          />
          <Route
            path="/user/edit/:id?/EditEventImpact"
            Component={EditEventImpact}
          />
          <Route
            path="/user/edit/:id?/EditEventManualOfStyle"
            Component={EditEventManualOfStyle}
          />
          <Route
            path="/user/edit/:id?/EditEventSynopsis"
            Component={EditEventSynopsis}
          />
          <Route
            path="/user/edit/:id?/EditItemBlurb"
            Component={EditItemBlurb}
          />
          <Route
            path="/user/edit/:id?/EditItemDescription"
            Component={EditItemDescription}
          />
          <Route
            path="/user/edit/:id?/EditItemManualOfStyle"
            Component={EditItemManualOfStyle}
          />
          <Route path="/user/edit/:id?/EditItemUses" Component={EditItemUses} />
          <Route
            path="/user/edit/:id?/EditLocationBlurb"
            Component={EditLocationBlurb}
          />
          <Route
            path="/user/edit/:id?/EditLocationCulture"
            Component={EditLocationCulture}
          />
          <Route
            path="/user/edit/:id?/EditLocationGeographyAndEcology"
            Component={EditLocationGeographyAndEcology}
          />
          <Route
            path="/user/edit/:id?/EditLocationHistory"
            Component={EditLocationHistory}
          />
          <Route
            path="/user/edit/:id?/EditLocationManualOfStyle"
            Component={EditLocationManualOfStyle}
          />
          <Route
            path="/user/edit/:id?/EditPowerSystemInfo"
            Component={EditPowerSystemInfo}
          />
          <Route
            path="/user/edit/:id?/EditPowerSystemManualOfStyle"
            Component={EditPowerSystemManualOfStyle}
          />
          <Route
            path="/user/edit/:id?/EditPowerSystemBlurb"
            Component={EditPowerSystemBlurb}
          />
          <Route
            path="/user/edit/:id?/EditRaceBlurb"
            Component={EditRaceBlurb}
          />
          <Route
            path="/user/edit/:id?/EditRaceCharacteristics"
            Component={EditRaceCharacteristics}
          />
          <Route
            path="/user/edit/:id?/EditRaceCulture"
            Component={EditRaceCulture}
          />
          <Route
            path="/user/edit/:id?/EditRaceHistory"
            Component={EditRaceHistory}
          />
          <Route
            path="/user/edit/:id?/EditRaceManualOfStyle"
            Component={EditRaceManualOfStyle}
          />
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
