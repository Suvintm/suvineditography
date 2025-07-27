import React from "react";
import logo from "../assets/logo.png";

const Cardcontainer = () => {
  return (
    <div className="flex flex-wrap justify-center items-center ">
      <div className="bg-white shadow-md rounded-lg flex flex-grow p-10 sm:m-20 justify-between m-4">
        <div>
          <h2 className="text-xl font-bold">Card Title</h2>
          <p className="text-gray-600">Card content goes here.</p>
        </div>
        <div>
          <img className=" h-20 object-fit" src={logo} alt="Placeholder" />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg flex flex-grow p-10 justify-between m-4 sm:m-20">
        <div>
          <h2 className="text-xl font-bold">Card Title</h2>
          <p className="text-gray-600">Card content goes here.</p>
        </div>
        <div>
          <img className=" h-20 object-fit" src={logo} alt="Placeholder" />
        </div>
      </div>
    </div>
  );
};

export default Cardcontainer;
