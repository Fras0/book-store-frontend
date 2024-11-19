import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context";
import { AuthProvider } from "./authContext";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import BookList from "./components/BookList/BookList";
import BookDetails from "./components/BookDetails/BookDetails";
import AddBook from "./pages/AddBook/AddBook";

import Login from "./pages/Login/Login-";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="books" element={<BookList />} />
          </Route>

          <Route path="/books/:id" element={<BookDetails />} />

          <Route path="about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-book" element={<AddBook />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
);
