import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";

import { createExpertAccount } from "../../../services/User/ExpertAccount";
import Loading from "../../../components/Loading";
import { changeRole } from "../../../Slice/authSlice";
import UserHome from "../../../components/User/UserHome";
import { toast } from "react-toastify";

const Landing = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
