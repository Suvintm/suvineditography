import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cardcontainer from "../components/Cardcontainer";

const Home = () => {
  return (
    <div className=" bg-[#8746f6] min-h-screen">
      <Navbar />
      <Header />
      <Cardcontainer />
    </div>
  );
};

export default Home;
