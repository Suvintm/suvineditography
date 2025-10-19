import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cardcontainer from "../components/Cardcontainer";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import BtnOwnModel from "../components/BtnOwnModel";
import FreeToolContainer from "../components/FreeToolsContainer";
import GoToStudio from "../components/GoToStudioCard";

const Home = () => {
  return (
    <div className="bg-black min-h-screen pt- sm:pt-28">
      {/* pt-20 for mobile, sm:pt-28 for larger screens */}
      <Navbar />
      <Header />
      <BtnOwnModel />
      <Carousel />
      <GoToStudio />
      <FreeToolContainer />
      <Cardcontainer />
      <Footer />
    </div>
  );
};

export default Home;
