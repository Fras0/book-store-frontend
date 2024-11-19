import React from "react";
import Header from "./../../components/Header/Header";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <main>
      <Header></Header>
      <Outlet></Outlet>
    </main>
  );
};

export default Home;
