import React, { useEffect, useState } from "react";
import Header from "@/components/Admin/Header";
import Sidebar from "@/components/Admin/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Eye, EyeOff, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { actionChange, createPlan, getAllPlans, updatePlan } from "@/services/Admin/subscription.service";
import { coreModule } from "@reduxjs/toolkit/dist/query";

interface Plan {
  _id: string;
  name: string;
  durationMonths: number;
  price: number;
  isActive: boolean;
  durationDisplay: string;
  createdAt: string;
  updatedAt: string;
}

const SubscriptionManagement = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getAllPlans();
        console.log(response.plans);
        setPlans(response.plans);
      } catch (error) {
        toast.error("Failed to fetch plans");
      }
    };
    fetchPlans();
  }, []);

  const [newPlan, setNewPlan] = useState({
    name: "",
    duration: "",
    price: "",
  });

  const handleAddPlan = async () => {
    try {
      const { name, duration, price } = newPlan;

      if (!name || !duration || !price) {
        toast.error("Please fill all fields!");
        return;
      }

      const durationMonths = parseInt(duration);
      const priceValue = parseFloat(price) ;

      if (!durationMonths || isNaN(durationMonths)) {
        toast.error("Invalid duration format (must be a number)");
        return;
      }

      if (!priceValue || isNaN(priceValue)) {
        toast.error("Invalid price format (must be a number)");
        return;
      }

      const response = await createPlan({ name, durationMonths, price: priceValue });
      console.log(response)
      if (response.success) {
        setPlans([...plans, response.plan]);
        setNewPlan({ name: "", duration: "", price: "" });
        toast.success("Plan added successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlan = async(id:string) => {
    try {
      if (!currentPlan) return;

      const response= await updatePlan(id,currentPlan)
      if(response.success){
        setPlans(
          plans.map((plan) =>
            plan._id === currentPlan._id ? { ...currentPlan } : plan
          )
        );
        setIsEditDialogOpen(false);
        toast.success("Plan updated successfully!");
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  const togglePlanStatus = async(id: string) => {
    try {
      console.log(id)
      const response= await actionChange(id)
      if(response.success){
        setPlans(
          plans.map((plan) =>
            plan._id === id ? { ...plan, isActive: !plan.isActive } : plan
          )
        );
        toast.info(
          `Plan ${plans.find((p) => p._id === id)?.isActive ? "unlisted" : "activated"}`
        );
      }
    } catch (error) {
      toast.error(error)
    }
    
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171730] text-white transition-all pt-14">
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)}
        />
        <main
          className={`p-5 transition-all duration-300 ${
            isSidebarExpanded ? "ml-64" : "ml-16"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6">Subscription Plans</h2>
                    {/* Add New Plan */}
           <Card className="p-6 rounded-lg mb-5">
            <h3 className="text-xl font-semibold mb-4">Create New Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="text"
                placeholder="Plan Name (e.g., Basic Plan)"
                value={newPlan.name}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, name: e.target.value })
                }
                className="text-black"
              />

              <Input
                type="number"
                placeholder="Duration in Months (e.g., 3)"
                value={newPlan.duration}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, duration: e.target.value })
                }
                className="text-black"
              />
              <Input
                type="number"
                placeholder="Price (e.g., 199)"
                value={newPlan.price}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, price: e.target.value })
                }
                className="text-black"
              />
            
              <Button
                onClick={handleAddPlan}
                className="bg-green-500 hover:bg-green-600"
              >
                Add Plan
              </Button>
            </div>
          </Card>

          {/* Existing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
            {plans.map((plan) => (
              <Card
                key={plan._id}
                className={`p-6 rounded-lg shadow-md relative ${
                  plan.isActive ? "bg-white text-black" : "bg-gray-700 text-white"
                }`}
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    plan.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>

                <h3 className="text-lg font-bold text-center">{plan.name}</h3>
                <p className="text-sm text-center text-gray-500">{plan.durationDisplay}</p>
                <p
                  className={`text-xl font-semibold text-center ${
                    plan.isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  ₹{plan.price}
                </p>
                <p
                  className={`text-sm text-center mt-2 ${
                    plan.isActive ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant={plan.isActive?'outline':'secondary'}
                    size="sm"
                    onClick={() => handleEditPlan(plan)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant={plan.isActive ? "destructive" : "success"}
                    size="sm"
                    onClick={() => togglePlanStatus(plan._id)}
                  >
                    {plan.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" /> Unlist
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" /> Activate
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>


          {/* Edit Plan Dialog */}
          <Dialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          >
            {currentPlan && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Subscription Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input
                        type="text"
                        value={currentPlan.name}
                        onChange={(e) =>
                          setCurrentPlan({
                            ...currentPlan,
                            name: e.target.value,
                          })
                        }
                        className="text-black"
                      />
                    </div>
                    <label className="block text-sm font-medium mb-1">
                      Duration (Months)
                    </label>
                    <Input
                      type="number"
                      value={currentPlan.durationMonths}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          durationMonths: parseInt(e.target.value) || 0,
                        })
                      }
                      className="text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Price
                    </label>
                    <Input
                      type="number"
                      value={currentPlan.price}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="text-black"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={()=>handleUpdatePlan(currentPlan._id)}>Save Changes</Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </main>
      </div>
    </>
  );
};

export default SubscriptionManagement;