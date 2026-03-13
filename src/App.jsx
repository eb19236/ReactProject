import "./App.css";
import Home from "./component/Home";
import Login from "./component/Login";
import ProjectsList from "./component/ProjectsList";
import DetailsProject from "./component/DetailsProject";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from "react";
import ProjectForm from "./component/ProjectForm";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <div className="App">
        {/* כותרת כללית שתוצג בכל העמודים */}
        <h1>מערכת ניהול פרויקטים</h1>

        <Routes>
          {/* דף הבית עם כפתור התחברות */}
          <Route path="/" element={<Home />} />

          {/* דף התחברות - המשתמש יישמר ב-Redux Slice */}
          <Route path="/Login" element={<Login />} />

          {/* דף רשימת פרויקטים - מוצג לאחר התחברות */}
          <Route path="/ProjectsList" element={<ProjectsList />} />
          <Route path="/AddProject" element={<ProjectForm />} />

          {/* דף פרטי פרויקט הכולל משימות ב-4 עמודות סטטוס */}
          <Route
            path="/DetailsProject/:projectId"
            element={<DetailsProject />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
