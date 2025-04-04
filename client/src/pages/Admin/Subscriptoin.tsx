import React, { useState } from "react";
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

interface Plan {
  id: string;
  duration: string;
  price: string;
  active: boolean;
  durationInDays: number;
}

const SubscriptionManagement = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

  // Enhanced plans data with IDs and status
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      duration: "1 Month",
      price: "₹199",
      active: true,
      durationInDays: 30,
    },
    {
      id: "2",
      duration: "3 Months",
      price: "₹399",
      active: true,
      durationInDays: 90,
    },
    {
      id: "3",
      duration: "6 Months",
      price: "₹699",
      active: true,
      durationInDays: 180,
    },
  ]);

  const [newPlan, setNewPlan] = useState({
    duration: "",
    price: "",
    durationInDays: 0,
  });

  const handleAddPlan = () => {
    if (!newPlan.duration || !newPlan.price || !newPlan.durationInDays) {
      toast.error("Please fill all fields!");
      return;
    }

    const plan: Plan = {
      id: Date.now().toString(),
      duration: newPlan.duration,
      price: newPlan.price,
      active: true,
      durationInDays: newPlan.durationInDays,
    };

    setPlans([...plans, plan]);
    setNewPlan({ duration: "", price: "", durationInDays: 0 });
    toast.success("Plan added successfully!");
  };

  const handleEditPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlan = () => {
    if (!currentPlan) return;

    setPlans(
      plans.map((plan) =>
        plan.id === currentPlan.id ? { ...currentPlan } : plan
      )
    );
    setIsEditDialogOpen(false);
    toast.success("Plan updated successfully!");
  };

  const togglePlanStatus = (id: string) => {
    setPlans(
      plans.map((plan) =>
        plan.id === id ? { ...plan, active: !plan.active } : plan
      )
    );
    toast.info(
      `Plan ${plans.find((p) => p.id === id)?.active ? "unlisted" : "activated"}`
    );
  };



  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#1E1E2F] text-white transition-all pt-14">
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)}
        />
        <main
          className={`p-5 transition-all duration-300 ${
            isSidebarExpanded ? "ml-64" : "ml-16"
          }`}
        >
          <h2 className="text-3xl font-bold mb-6">Subscription Plans</h2>

     

          {/* Existing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-6 rounded-lg shadow-md relative ${
                  plan.active ? "bg-white text-black" : "bg-gray-700 text-white"
                }`}
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    plan.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {plan.active ? "Active" : "Inactive"}
                </span>

                <h3 className="text-lg font-bold text-center">{plan.duration}</h3>
                <p
                  className={`text-xl font-semibold text-center ${
                    plan.active ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {plan.price}
                </p>
                <p
                  className={`text-sm text-center mt-2 ${
                    plan.active ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  {plan.durationInDays} days visibility
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPlan(plan)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant={plan.active ? "destructive" : "success"}
                    size="sm"
                    onClick={() => togglePlanStatus(plan.id)}
                  >
                    {plan.active ? (
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

          {/* Add New Plan */}
          <Card className="p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Create New Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="text"
                placeholder="Duration (e.g., 1 Month)"
                value={newPlan.duration}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, duration: e.target.value })
                }
                className="text-black"
              />
              <Input
                type="text"
                placeholder="Price (e.g., ₹199)"
                value={newPlan.price}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, price: e.target.value })
                }
                className="text-black"
              />
              <Input
                type="number"
                placeholder="Duration in days"
                value={newPlan.durationInDays || ""}
                onChange={(e) =>
                  setNewPlan({
                    ...newPlan,
                    durationInDays: parseInt(e.target.value) || 0,
                  })
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
                    <label className="block text-sm font-medium mb-1">
                      Duration
                    </label>
                    <Input
                      type="text"
                      value={currentPlan.duration}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          duration: e.target.value,
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
                      type="text"
                      value={currentPlan.price}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          price: e.target.value,
                        })
                      }
                      className="text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duration in Days
                    </label>
                    <Input
                      type="number"
                      value={currentPlan.durationInDays}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          durationInDays: parseInt(e.target.value) || 0,
                        })
                      }
                      className="text-black"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="activeStatus"
                      checked={currentPlan.active}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          active: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="activeStatus">Active Plan</label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdatePlan}>Save Changes</Button>
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