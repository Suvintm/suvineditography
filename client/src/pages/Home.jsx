import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cardcontainer from "../components/Cardcontainer";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className=" bg-black min-h-screen">
      <Navbar />
      <Header />
      <Carousel />;
      <Cardcontainer />
      <Footer />
    </div>
  );
};

export default Home;
