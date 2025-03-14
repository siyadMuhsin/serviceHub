import { useParams } from 'react-router-dom'
import { getExpertData } from '../../services/Admin/expert.service'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'

const ExpertDetailsPage = () => {
    const [expertData, setExpertData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
   
    useEffect(() => {
        const fetchExpertData = async (id) => {
            try {
                const response = await getExpertData(id)
                if (response.success) {
                    setExpertData(response.expert)
                }
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchExpertData(id)
    }, [id])

    console.log(expertData)

    return (
        <div className=" mx-auto px-4 py-6">
            {loading && <Loading />}
            {expertData && (
                <div className="bg-white shadow-xl rounded-xl p-6">
                    {/* Header Section */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">{expertData.accountName}</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Status: 
                            <span className={`ml-2 font-semibold ${expertData.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                                {expertData.status}
                            </span>
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div>
                            {/* Profile Image */}
                            <img 
                                src={expertData.certificateUrl} 
                                alt="Certificate" 
                                className="w-full h-60 object-cover rounded-lg border"
                            />

                            {/* Personal Info */}
                            <div className="mt-4 space-y-2">
                                <div>
                                    <span className="font-semibold text-gray-700">📧 Email:</span>
                                    <p className="text-gray-600">{expertData.userId?.email}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">📞 Contact:</span>
                                    <p className="text-gray-600">{expertData.contact}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">💼 Experience:</span>
                                    <p className="text-gray-600">{expertData.experience} years</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">📅 Date of Birth:</span>
                                    <p className="text-gray-600">{new Date(expertData.dob).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            {/* Category and Service Info */}
                            <div className="space-y-4">
                                <div>
                                    <span className="font-semibold text-gray-700">🔖 Category:</span>
                                    <p className="text-gray-600">{expertData.categoryId?.name}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">🛠️ Service:</span>
                                    <p className="text-gray-600">{expertData.serviceId?.name}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">📑 Description:</span>
                                    <p className="text-gray-600">{expertData.categoryId?.description}</p>
                                </div>
                            </div>

                            {/* Service Image */}
                            <div className="mt-4">
                                <img 
                                    src={expertData.serviceId?.image} 
                                    alt="Service" 
                                    className="w-full h-40 object-cover rounded-lg border"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-6 border-t pt-4 flex justify-between items-center text-gray-600">
                        <div>
                            <span className="font-semibold text-gray-700">✅ Approved:</span>
                            <span className={`ml-2 ${expertData.isApproved ? 'text-green-500' : 'text-red-500'}`}>
                                {expertData.isApproved ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">🕒 Created At:</span>
                            <span className="ml-2">{new Date(expertData.createdAt).toLocaleString()}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">🔄 Updated At:</span>
                            <span className="ml-2">{new Date(expertData.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExpertDetailsPage
