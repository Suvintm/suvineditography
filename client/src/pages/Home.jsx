import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cardcontainer from "../components/Cardcontainer";

const Home = () => {
  return (
    <div className=" bg-gradient-to-b from-[#2066cf] to-[#e3f0ff] min-h-screen">
      <Navbar />
      <Header />
      <Cardcontainer />
    </div>
  );
};

export default Home;
