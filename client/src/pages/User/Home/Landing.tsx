import { useEffect, useState } from "react";

import Loading from "../../../components/Loading";

import UserHome from "../../../components/User/UserHome";


const Landing = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
 

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      {isLoading && <Loading />}
    
      <UserHome  /> {/* This pushes content down */}
      
    </div>
  );
};

export default Landing;
