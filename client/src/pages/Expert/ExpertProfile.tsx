import { IExpert } from '@/Interfaces/interfaces'
import { get_expert } from '@/services/Expert/expert.service'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Loading from '@/components/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { setExpertLocation } from '@/Slice/locationSlice'
import ExpertLocationCard from '@/components/Expert/ExpertLocationCard'
import ExpertGallery from '@/components/Expert/ExpertGallery'
import { toast } from 'react-toastify'
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Briefcase,
  MapPin,
  Award,
  BadgeCheck,
  ShieldCheck,
  CreditCard
} from 'lucide-react'
import { fetchLocationFromCoordinates } from '@/components/Location/FethLocation'

function ExpertProfile() {
  const [expertData, setExpertData] = useState<IExpert | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { expertLocation } = useSelector((state: any) => state.location)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await get_expert()
        
        if (!response) {
          throw new Error('No response received from server')
        }

        if (response.success) {
          setExpertData(response.expert)
          
          if (!expertLocation.lat && response.expert.location) {
            try {
              const location = response.expert.location
              const locationData = await fetchLocationFromCoordinates(
                location.coordinates[1], 
                location.coordinates[0]
              )
              
              if (locationData) {
                dispatch(setExpertLocation({
                  lat: location.coordinates[1],
                  lng: location.coordinates[0],
                  address: locationData
                }))
              }
            } catch (locationError) {
              console.error("Error fetching location data:", locationError)
              toast.warn("Could not fetch detailed location information")
            }
          }
        } else {
          throw new Error(response.message || 'Failed to fetch expert data')
        }
      } catch (error) {
        console.error("Error fetching expert data:", error)
        setError(error.message || 'An unknown error occurred')
        toast.error(error.message || 'Failed to load expert profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpertData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!expertData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h4 className="text-lg font-medium text-gray-700">Expert data not found</h4>
          <p className="text-gray-500 mt-2">
            The requested expert profile could not be loaded. Please try again later.
          </p>
        </div>
      </div>
    )
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
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCA5YTMgMyAwIDEwMC02IDMgMyAwIDAwMCA2em0tNyA5YTcgNyAwIDExMTQgMEgzeiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+'
                }}
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{expertData.userId.name}</h1>
                <div className="flex items-center gap-4 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {expertData.serviceId?.name || 'No service specified'}
                  </span>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {expertData.categoryId?.name || 'No category specified'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                  <p className="flex items-start">
                    <Phone className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
                    {expertData.contact || 'Not specified'}
                  </p>
                  <p className="flex items-start">
                    <Mail className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
                    {expertData.userId.email || 'Not specified'}
                  </p>
                  <p className="flex items-start">
                    <Calendar className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
                    {expertData.dob ? format(new Date(expertData.dob), 'MMM dd, yyyy') : 'Not specified'}
                  </p>
                  <p className="flex items-start">
                    <User className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
                    {expertData.gender || 'Not specified'}
                  </p>
                  <p className="flex items-start">
                    <Briefcase className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
                    {expertData.experience ? `${expertData.experience} years experience` : 'Experience not specified'}
                  </p>
                  {/* {expertData.userId.location && (
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mt-0.5 mr-1 flex-shrink-0" />
                      {expertData.userId.location}
                    </p>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExpertLocationCard expertData={expertData} />

      {/* Account & Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Account Information
          </h3>
          <div className="space-y-3">
            <p className="flex items-start">
              <span className="font-medium text-gray-700">Account Name:</span> 
              <span className="ml-1">{expertData.accountName || 'Not specified'}</span>
            </p>
            <p className="flex items-start">
              <span className="font-medium text-gray-700">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                expertData.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : expertData.isBlocked 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {expertData.isBlocked ? 'Blocked' : expertData.status || 'Unknown'}
              </span>
            </p>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </h3>
          {expertData.subscription?.isActive ? (
            <div className="space-y-3">
              <p>
                <span className="font-medium text-gray-700">Plan:</span> {expertData.subscription.plan?.name || 'No plan name'}
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
                <span className="font-medium text-gray-700">Period:</span> 
                {expertData.subscription.startDate 
                  ? format(new Date(expertData.subscription.startDate), 'MMM dd, yyyy') 
                  : 'No start date'} - 
                {expertData.subscription.endDate 
                  ? format(new Date(expertData.subscription.endDate), 'MMM dd, yyyy') 
                  : 'No end date'}
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certification
          </h3>
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BadgeCheck className="w-8 h-8 text-blue-500 mr-3" />
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
      <ExpertGallery expertData={expertData} />
      {isLoading && <Loading />}
    </div>
  )
}

export default ExpertProfile