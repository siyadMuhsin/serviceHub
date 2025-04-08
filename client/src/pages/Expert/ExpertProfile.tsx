import { IExpert } from '@/Interfaces/interfaces'
import { get_expert } from '@/services/Expert/expert.service'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Loading from '@/components/Loading'
import { number } from 'yup'
import { fetchLocationFromCoordinates } from '@/components/Location/FethLocation'
import { useDispatch, useSelector } from 'react-redux'
import { setExpertLocation } from '@/Slice/locationSlice'
import ExpertLocationCard from '@/components/Expert/ExpertLocationCard'
import ExpertGallery from '@/components/Expert/ExpertGallery'



function ExpertProfile() {
  const [expertData, setExpertData] = useState<IExpert>()
  const [location,setLocation]=useState({lat:number,lng:number})
  const [locationAddress,setLocationAddress]=useState('')
  const {expertLocation}=useSelector((state:any)=>state.location)
const dispatch=useDispatch()
  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const response = await get_expert()
        if (response.success) {
          setExpertData(response.expert)
          if(!expertLocation.lat){
            if(response.expert.location){
              const location=response.expert.location
              const locationData= await fetchLocationFromCoordinates(location.coordinates[1],location.coordinates[0])
        dispatch(setExpertLocation({lat:location.coordinates[1],lng:location.coordinates[0],address:locationData}))
            }
          }
          
         
          
        }
      } catch (error) {
        console.error("Error fetching expert data:", error)
      }
    }
    fetchExpertData()
  
  }, [])

  if (!expertData) {
    return <Loading/>
  }
                                                                           
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture Placeholder */}
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
  {expertData.userId.profile_image ? (
    <img 
      src={expertData.userId.profile_image} 
      alt={`${expertData.userId.name}'s profile`}
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCA5YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2em0tNyA5YTcgNyAwIDExMTQgMEgzeiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+';
      }}
    />
  ) : (
    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  )}
</div>
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{expertData.userId.name}</h1>
                <div className="flex items-center gap-4 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {expertData.serviceId.name}
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {expertData.categoryId.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                  {/* <p className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {expertData.userId.location}
                  </p> */}
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {expertData.contact}
                  </p>
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {expertData.userId.email}
                  </p>
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {format(new Date(expertData.dob), 'MMM dd, yyyy')}
                  </p>
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {expertData.gender}
                  </p>
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    {expertData.experience} years experience
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <ExpertLocationCard
  expertData={expertData}
 
/>
      {/* Account & Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
          <div className="space-y-3">
            <p>
              <span className="font-medium text-gray-700">Account Name:</span> {expertData.accountName}
            </p>
            <p>
              <span className="font-medium text-gray-700">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                expertData.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : expertData.isBlocked 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {expertData.isBlocked ? 'Blocked' : expertData.status}
              </span>
            </p>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Subscription</h3>
          {expertData.subscription ? (
            <div className="space-y-3">
              <p>
                <span className="font-medium text-gray-700">Plan:</span> {expertData.subscription.plan.name}
              </p>
              <p>
                <span className="font-medium text-gray-700">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  expertData.subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {expertData.subscription.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Period:</span> {format(new Date(expertData.subscription.startDate), 'MMM dd, yyyy')} - {format(new Date(expertData.subscription.endDate), 'MMM dd, yyyy')}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No active subscription</p>
          )}
        </div>
      </div>

      {/* Certificate Section */}
      {expertData.certificateUrl && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Certification</h3>
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Professional Certification</p>
                  <p className="text-sm text-gray-500">Verified credential</p>
                </div>
              </div>
              <a 
                href={expertData.certificateUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Certificate
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Work Showcase Section */}
   <ExpertGallery expertData={expertData}/>
    </div>
  )
}

export default ExpertProfile