import { useParams } from "react-router-dom";
import { getExpertData } from "../../services/Admin/expert.service";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const ExpertDetailsPage = () => {
  const [expertData, setExpertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchExpertData = async (id) => {
      try {
        const response = await getExpertData(id);
        if (response.success) {
          setExpertData(response.expert);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpertData(id);
  }, [id]);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  // Calculate expert age
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const age = new Date(difference).getUTCFullYear() - 1970;
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading expert details...
          </p>
        </div>
      </div>
    );
  }

  if (!expertData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-[#171730]">
            <CardTitle className="text-red-700">Expert Not Found</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">
              The expert details you're looking for could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 ">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-4">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="px-6 pb-6">
              <div className="flex justify-center -mt-16">
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarImage
                    src={expertData.userId.profile_image}
                    alt={expertData.accountName}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl">
                    {expertData.accountName?.charAt(0) || "E"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center mt-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {expertData.accountName}
                </h2>
                <p className="text-sm text-gray-500">
                  {expertData.userId?.email}
                </p>
                <div className="mt-2">
                  <Badge
                    className={`${getStatusColor(
                      expertData.status
                    )} px-3 py-1 font-medium rounded-full`}
                  >
                    {expertData.status}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 mt-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600">📞</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{expertData.contact}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600">💼</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <div className="flex items-center">
                      <p className="font-medium">
                        {expertData.experience} years
                      </p>
                      <Progress
                        className="h-2 w-24 ml-2"
                        value={Math.min(expertData.experience * 4, 100)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age & Birth Date</p>
                    <p className="font-medium">
                      {calculateAge(expertData.dob)} years •{" "}
                      {new Date(expertData.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600">⚧️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{expertData.gender}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="certificate">Certificate</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center">
                    <span className="mr-2">📋</span> Expert Information
                  </CardTitle>
                  <CardDescription>
                    Complete expert profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <span className="text-indigo-600 mr-2">🔖</span>
                        Category Details
                      </h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-semibold">
                          {expertData.categoryId?.name}
                        </p>
                        <p className="text-gray-600 mt-2">
                          {expertData.categoryId?.description}
                        </p>
                        <Badge
                          className="mt-2"
                          variant={
                            expertData.categoryId?.isActive
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {expertData.categoryId?.isActive
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <span className="text-purple-600 mr-2">🛠️</span>
                        Service Details
                      </h3>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="font-semibold">
                          {expertData.serviceId?.name}
                        </p>
                        <p className="text-gray-600 mt-2">
                          {expertData.serviceId?.description}
                        </p>
                        <Badge
                          className="mt-2"
                          variant={
                            expertData.serviceId?.isActive
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {expertData.serviceId?.isActive
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificate">
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center">
                    <span className="mr-2">🎓</span> Expert Certificate
                  </CardTitle>
                  <CardDescription>Verification document</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <img
                      src={expertData.certificateUrl}
                      alt="Expert Certificate"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="service">
              <Card>
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="flex items-center">
                    <span className="mr-2">📌</span> Service Details
                  </CardTitle>
                  <CardDescription>
                    Service offered by this expert
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Service Information
                      </h3>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <p className="font-semibold">
                          {expertData.serviceId?.name}
                        </p>
                        <p className="text-gray-600 mt-2">
                          {expertData.serviceId?.description}
                        </p>
                        <div className="flex items-center mt-3">
                          <span className="text-sm text-gray-500 mr-2">
                            Category:
                          </span>
                          <Badge variant="outline">
                            {expertData.categoryId?.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Service Image
                        </h3>
                        <div className="bg-white border rounded-lg overflow-hidden">
                          <img
                            src={expertData.serviceId?.image}
                            alt="Service Image"
                            className="w-full h-auto max-h-64 object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-orange-50 flex justify-between">
                  <p className="text-sm text-gray-600">
                    ID: {expertData.serviceId?._id.toString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Created:{" "}
                    {new Date(
                      expertData.serviceId?.createdAt
                    ).toLocaleDateString()}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetailsPage;
