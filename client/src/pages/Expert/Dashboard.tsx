import { Bell, User, FileText, CheckCircle, Clock, Users } from "lucide-react"
import { differenceInDays, differenceInMonths } from 'date-fns';
import { Footer } from "@/components/Expert/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { get_expert } from "@/services/Expert/expert.service"
import { toast } from "react-toastify"
import SubscriptionPage from "./SubscriptionPage"
import { Link } from "react-router-dom"
import Loading from "@/components/Loading"

const recentRequests = [
  {
    clientName: "Alice Cooper",
    serviceType: "Home Cleaning",
    date: "2025-02-19",
    status: "Completed",
  },
  {
    clientName: "Bob Martin",
    serviceType: "Gardening",
    date: "2025-02-19",
    status: "Pending",
  },
  {
    clientName: "Carol Davis",
    serviceType: "Plumbing",
    date: "2025-02-18",
    status: "Rejected",
  },
]

export default function Dashboard() {
  const [loading,setLoading]=useState<boolean>(true)
  const [isPlan,setPlan]=useState(false)
  const [expert,setExpert]=useState<any>()
  useEffect(()=>{
    
    const fetchData=async()=>{
      try {
        const response= await get_expert()
       if(response.success){
      
        setExpert(response.expert)
       }
      } catch (error) {
        toast.error(error.message || "error in fetching expert date")
      }finally{
        setLoading(false)
      }
    }
    fetchData()
  },[])

//   const 
// const monthsRemaining = differenceInMonths(endDate, new Date());
  if(!expert){
    return(<Loading/>)
  }
  let daysRemaining: number | null = null;

  if (expert.subscription.plan&&expert.subscription.plan.isActive) {
    const endDate = new Date(expert.subscription.endDate);
    daysRemaining = differenceInDays(endDate, new Date());
  }

  return (
  
    <div className="flex flex-col w-[100%]">
      <div className="flex flex-1">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            {/* Header with welcome message and buttons */}
            <div className="mb-8 flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm">
              <h2 className="text-xl font-medium text-gray-700">Welcome,{expert?.accountName} 👋</h2>
              <div className="flex items-center gap-4">
                <Button variant="link" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    2
                  </span>
                </Button>
                <Button variant="link" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                {!expert.subscription.isActive ? (
  <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 animate-pulse rounded-md flex items-center justify-between">
    <div>
      <p className="font-semibold">Your subscription is inactive.</p>

    </div>
    <Link
      to="/expert/subscription"
      state={{ expert }}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
    >
      Purchase Subscription
    </Link>
  </div>
) : (
  <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md flex items-center justify-between">
    <span className="text-sm font-medium">
      Subscription Active:{" "}
      <span className="font-bold">{daysRemaining} days remaining</span>
    </span>
  </div>
)}
              </div>
            </div>

            {/* Stats cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <FileText className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">125</p>
                    <p className="text-sm text-gray-600">Total Requests</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <CheckCircle className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">98</p>
                    <p className="text-sm text-gray-600">Completed Jobs</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Clock className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">27</p>
                    <p className="text-sm text-gray-600">Pending Requests</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Status */}
            <Card className="mb-8">
              <CardContent className="flex items-center p-6">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Users className="h-6 w-6 text-gray-700" />
                </div>
                
              </CardContent>
            </Card>

            {/* Recent Service Requests */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-gray-800">Recent Service Requests</h3>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRequests.map((request) => (
                      <TableRow key={`${request.clientName}-${request.serviceType}`}>
                        <TableCell className="font-medium">{request.clientName}</TableCell>
                        <TableCell>{request.serviceType}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "Completed"
                                ? "success"
                                : request.status === "Pending"
                                  ? "warning"
                                  : "destructive"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}