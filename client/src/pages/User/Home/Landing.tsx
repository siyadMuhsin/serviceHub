import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import Navbar from "../../../components/User/Navbar";
import CreateExpertModal from "../../../components/User/modals/CreateExpertModal";
import { adminAPI } from "../../../../axiosConfig";
import { setInitialCategories, setInitialServices } from "../../../Slice/categoryServiceSlice";
import { createExpertAccount } from "../../../services/User/createExpertAccount";
import Loading from "../../../components/Loading"; 
import { changeRole } from "../../../Slice/authSlice";
import { FaBullseye } from "react-icons/fa";
import { toast } from "react-toastify";

const Landing = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
    const { categories, services } = useSelector((state: RootState) => state.categoryService);
    const {user}=useSelector((state:RootState)=>state.auth)
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true); // Show loading
                const categoriesRes = await adminAPI.get("/categories");
                const servicesRes = await adminAPI.get("/services");
                dispatch(setInitialCategories(categoriesRes.data.categories));
                dispatch(setInitialServices(servicesRes.data.services));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false); // Hide loading
            }
        };
        fetchData();
    }, [dispatch]);

    console.log(user)
    const handleCreateExpert = async (expertData: any) => {
        
        setIsLoading(true); // Show loading when request starts

        try {
            const formData = new FormData();
            formData.append("fullName", expertData.fullName);
            formData.append("dob", expertData.dob);
            formData.append("gender", expertData.gender);
            formData.append("contact", expertData.contact);
            formData.append("experience", expertData.experience);
            formData.append("serviceId", expertData.service);
            formData.append("categoryId", expertData.category);

            if (expertData.certificate instanceof File) {
                formData.append("certificate", expertData.certificate);
            } else if (expertData.certificate && expertData.certificate[0]) {
                formData.append("certificate", expertData.certificate[0]);
            }

            const response = await createExpertAccount(formData);
            console.log("from landing",response)
            if(response.success){
                
                dispatch(changeRole("expert"))
                setIsModalOpen(false)
                toast.success(response.message)
            }
            console.log("Response:", response);
        } catch (error) {
            console.error("Error uploading expert:", error);
        } finally {
            setIsLoading(false); // Hide loading when request is completed
        }
    };

    return (
        <>
            <Navbar />

            {isLoading && <Loading />} {/* Show loading spinner when request is in progress */}

            {user.role === 'user' ? (
    <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
    >
        Create Expert Account
    </button>
) : (
    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Switch to Expert Account
    </button>
)}
           

            <CreateExpertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateExpert}
                categories={categories}
                services={services}
            />
        </>
    );
};

export default Landing;
