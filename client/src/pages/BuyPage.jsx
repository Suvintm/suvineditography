import React, { useState, useContext, useEffect } from "react";
import logo from "../assets/logo.png";
import { IoIosOptions, IoMdClose } from "react-icons/io";
import { WalletIcon } from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";

// Credit packages
const creditPackages = [
  {
    id: 1,
    name: "Basic",
    credits: 50,
    price: 5, // INR
    description: "Get started with 50 credits",
    bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
  {
    id: 2,
    name: "Standard",
    credits: 120,
    price: 10,
    description: "Best value: 120 credits",
    bgColor: "bg-gradient-to-r from-green-400 to-teal-500",
  },
  {
    id: 3,
    name: "Premium",
    credits: 250,
    price: 20,
    description: "Unlock 250 credits",
    bgColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
  {
    id: 4,
    name: "Ultimate",
    credits: 500,
    price: 35,
    description: "500 credits for power users",
    bgColor: "bg-gradient-to-r from-red-400 to-pink-500",
  },
];

const BuyPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { credits, user, token, backendUrl, setCredits } =
    useContext(AppContext);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay SDK loaded");
      script.onerror = () => console.error("Razorpay SDK failed to load");
      document.body.appendChild(script);
    }
  }, []);

 const handleBuy = async (pkg) => {
   if (!token) return toast.error("You must be logged in to buy credits.");

   try {
     const res = await axios.post(
       `${backendUrl}/api/payment/create-order`,
       {
         amount: pkg.price, // send actual INR amount, backend multiplies by 100
         credits: pkg.credits,
         packName: pkg.name,
       },
       { headers: { Authorization: `Bearer ${token}` } }
     );

     const { order } = res.data;

     const options = {
       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
       amount: order.amount,
       currency: order.currency,
       name: "SuvinEditography",
       description: pkg.description,
       order_id: order.id,
       handler: async function (response) {
         // Send payment details to backend to verify & update DB
         await axios.post(
           `${backendUrl}/api/payment/verify-payment`,
           {
             razorpay_order_id: response.razorpay_order_id,
             razorpay_payment_id: response.razorpay_payment_id,
             razorpay_signature: response.razorpay_signature,
             credits: pkg.credits,
           },
           { headers: { Authorization: `Bearer ${token}` } }
         );

         toast.success(`${pkg.credits} credits added!`);
         setCredits((prev) => prev + pkg.credits);
       },
       prefill: { name: user.name, email: user.email },
       notes: { userId: user.id, credits: pkg.credits, packName: pkg.name },
       theme: { color: "#2563EB" },
     };

     const rzp = new window.Razorpay(options);
     rzp.open();
   } catch (error) {
     console.error("Payment error:", error.response || error.message);
     toast.error("Payment failed. Check console.");
   }
 };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full px-4 sm:px-20 py-4 flex justify-between items-center bg-white shadow-md z-50">
        <div className="flex items-center gap-1">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-black rounded-3xl"
          />
          <span className="font-bold text-[16px] sm:text-2xl text-black">
            SuvinEditography
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 sm:gap-3 text-[12px] sm:text-[16px] bg-black/20 border border-black/30 items-center justify-center px-3 py-2 rounded-full font-medium text-black">
            <WalletIcon className="w-5 h-5 sm:w-6 sm:h-6" /> Credits: {credits}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-black text-2xl sm:text-3xl"
          >
            <IoIosOptions />
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 sm:w-80 bg-white shadow-lg p-4 rounded-l-3xl transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="flex justify-end">
          <button onClick={toggleSidebar} className="text-2xl font-bold">
            <IoMdClose />
          </button>
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">Sidebar Menu</h2>
          <p className="mt-2 text-gray-600">You can add links here later</p>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-30 z-40"
        ></div>
      )}

      {/* Header */}
      <header className="pt-28 text-center py-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Buy Credits
        </h1>
        <p className="text-gray-500 mt-2">
          Choose a package and start using our premium tools
        </p>
      </header>

      {/* Packages */}
      <main className="pt-4 px-4 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {creditPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition duration-300 ${pkg.bgColor}`}
          >
            <span className="absolute top-3 right-3 bg-black/30 px-2 py-1 rounded-full text-xs">
              {pkg.name}
            </span>
            <h2 className="text-2xl font-bold">{pkg.name}</h2>
            <p className="mt-2 text-lg">{pkg.description}</p>
            <p className="mt-4 text-4xl font-extrabold">
              {pkg.credits} Credits
            </p>
            <p className="mt-1 text-xl font-semibold">₹{pkg.price}</p>
            <button
              onClick={() => handleBuy(pkg)}
              className="mt-6 w-full bg-white text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Buy Now
            </button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default BuyPage;
