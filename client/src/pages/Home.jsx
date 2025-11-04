import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cardcontainer from "../components/Cardcontainer";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import BtnOwnModel from "../components/BtnOwnModel";
import FreeToolContainer from "../components/FreeToolsContainer";
import GoToStudio from "../components/GoToStudioCard";
import LoaderAnimation from "../components/LoaderAnimation";
import PaymentPacksSection from "../components/PaymentPacksSection";

const Home = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000); // 200ms delay
    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return (
      <LoaderAnimation
        src="/animations/loader.lottie"
        width={220}
        height={220}
        logoSrc="/logo.png" // optional, default provided
        appName="SuvinEditography" // optional, default provided
      />
    );
  }


  return (
    <div className="bg-black min-h-screen pt-0 sm:pt-28">
      <Navbar />
      <Header />
      <BtnOwnModel />
      <Carousel />
      <GoToStudio />
      <PaymentPacksSection />
      <FreeToolContainer />
      <Cardcontainer />
      <Footer />
    </div>
  );
};

export default Home;
