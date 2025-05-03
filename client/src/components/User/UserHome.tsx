import React from "react";
import Footer from "./Footer";

const ServiceMarketplace = () => {
  return (
    <div className="flex-grow font-sans">
      {/* Hero Section */}
      <div className="w-full h-auto md:h-96 bg-gray-100 flex flex-col md:flex-row items-center">
        {/* Left Content Section - order changes on mobile */}
        <div className="w-full md:flex-1 p-4 md:pl-10 order-2 md:order-1">
          <div className="bg-blue-700 text-white p-4 md:p-6 rounded-lg max-w-md mx-auto md:mx-0">
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              Sparkling Clean Home, Hassle-Free!
            </h1>
            <p className="mb-4 text-xs md:text-sm">
              Tired of dust and mess? Let our professional house cleaners bring
              freshness to your home. We provide deep cleaning, sanitization,
              and organizing services to make your space shine.
            </p>
            <button className="bg-white text-blue-700 px-3 py-1 md:px-4 md:py-2 rounded-md font-medium hover:bg-blue-50 transition text-sm md:text-base">
              Connect With Us
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:flex-1 h-48 md:h-full order-1 md:order-2">
          <div
            className="w-full h-full bg-cover bg-center rounded-sm"
            style={{ backgroundImage: "url('/home-servicve.jfif')" }}
          ></div>
        </div>
      </div>

      {/* Education Section */}
      <div className="py-6 md:py-8 px-4 md:px-10 bg-white">
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start">
          <div className="md:w-1/2 p-4 space-y-4 md:mt-28 w-full">
            <div className="max-w-96">
              <h2 className="text-xl md:text-2xl font-bold text-blue-800 leading-snug">
                Ace Your <span className="text-green-500">Exams</span> with
                Expert School Tuition!
              </h2>
              <p className="text-xs md:text-sm text-gray-600">
                Struggling with tough subjects? Get personalized tuition from
                experienced teachers to boost your confidence and grades!
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-4 flex justify-center md:justify-end">
            <img
              src="/edu-girl.png"
              alt="Student studying"
              className="rounded-lg shadow-md w-full max-w-[480px] object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-14 mt-6 md:mt-0">
          <div className="w-full md:w-1/2 p-4">
            <img
              src="/profilegraph.png"
              alt="Student Profile"
              className="rounded-lg shadow-md w-full max-w-[480px] object-cover mx-auto"
            />
          </div>
          <div className="w-full md:w-1/2 p-4 space-y-4 md:mt-28">
            <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-4 leading-snug">
              A Huge Community of Trusted Experts at Your Service!
            </h2>
            <p className="text-xs md:text-sm text-gray-600 max-w-3xl leading-relaxed">
              No matter the task, you can find exactly what you need in our vast
              community. From home repairs to personal assistance, our network
              of skilled professionals is here to make your life easier.
            </p>
          </div>
        </div>
      </div>

      {/* Popular Services Section */}
      <div className="py-6 px-4 md:px-10 bg-white">
        <h3 className="text-lg font-semibold mb-4">Popular Services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          <ServiceCard image="/painterwall.jpg" title="Painter" />
          <ServiceCard image="/electrition.jpg" title="Electrician" />
          <ServiceCard image="/plumber.webp" title="Plumber" />
          <ServiceCard image="/vehcleMechanic.jpg" title="Mechanical" />
        </div>
      </div>

      {/* Choose Your Expert Section */}
      <div className="py-6 px-4 md:px-10 bg-white">
        <h3 className="text-lg font-semibold mb-4">Choose your Expert</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          <img
            src="/painter.webp"
            alt="Expert 1"
            className="w-full h-28 md:h-36 object-cover rounded-md shadow-sm"
          />
          <img
            src="/interior-designer.webp"
            alt="Expert 2"
            className="w-full h-28 md:h-36 object-cover rounded-md shadow-sm"
          />
          <img
            src="/water-service.jfif"
            alt="Expert 3"
            className="w-full h-28 md:h-36 object-cover rounded-md shadow-sm"
          />
          <img
            src="/electrition.jpg"
            alt="Expert 4"
            className="w-full h-28 md:h-36 object-cover rounded-md shadow-sm"
          />
        </div>
      </div>

      {/* Interior Design Section */}
      <div className="relative w-full h-[50vh] md:h-[80vh] mt-8 flex justify-center md:justify-end items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/interior-designer.webp')" }}
        ></div>
        <div className="relative bg-blue-700 text-white p-4 md:p-6 rounded-lg max-w-md mx-4 md:mr-10">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Transform Your Bedroom Into a Cozy Paradise! ✨
          </h2>
          <p className="mb-4 text-xs md:text-sm">
            Looking for a dreamy makeover for your bedroom? Our expert designers
            bring elegance, comfort, and style to your space! From modern
            minimalism to luxurious aesthetics, we customize your room to match
            your taste.
          </p>
          <button className="bg-white text-blue-700 px-3 py-1 md:px-4 md:py-2 rounded-md font-medium hover:bg-blue-50 transition text-sm md:text-base">
            Contact With Us
          </button>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-8 md:py-10 px-4 md:px-10 bg-white">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
          What Our Users Say's
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <TestimonialCard name="Natasha Kelvin" image={"/profile1.jfif"} />
          <TestimonialCard name="Natasha Kelvin" image={"/profile2.jpg"} />
          <TestimonialCard name="Natasha Kelvin" image={"/profile3.webp"} />
          <TestimonialCard name="Natasha Kelvin" image={"/profile4.jfif"} />
        </div>
      </div>
    </div>
  );
};

// Reusable Service Card Component
const ServiceCard = ({ image, title }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-20 sm:h-24 md:h-32 mb-2">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <p className="text-xs sm:text-sm font-medium">{title}</p>
    </div>
  );
};

// Reusable Testimonial Card Component
const TestimonialCard = ({ name, image }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm">
      <div className="flex items-center mb-3">
        <img 
          src={image} 
          alt={name} 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3" 
        />
        <div>
          <h4 className="font-medium text-xs md:text-sm">{name}</h4>
          <div className="flex text-yellow-400 text-xs md:text-sm">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </div>
      </div>
      <p className="text-xs md:text-sm text-gray-600">
        "I'd an account from your personal designer, so simply contact your
        agent and see what you have to offer. Contact with me, share your
        expertise and make sure that your site."
      </p>
    </div>
  );
};

export default ServiceMarketplace;