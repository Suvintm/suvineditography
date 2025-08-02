import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cardcontainer from "../components/Cardcontainer";
import Carousel from "../components/Carousel";

const Home = () => {
  return (
    <div className=" bg-[#0a080e] min-h-screen">
      <Navbar />
      <Header />
      <Carousel />;
      <Cardcontainer />
    </div>
  );
};

export default Home;
