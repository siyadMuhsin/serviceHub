import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { changePassword } from '@/services/User/profile.service';
import ConfirmModal from '@/Utils/Confirmation';

function ChangePassword({ setCurrentView }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirm,setConfirm]=useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await changePassword(passwordData.currentPassword,passwordData.newPassword);
      if (response.success) {
        toast.success(response.message);
        setCurrentView('overview');
        resetForm();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
        console.log(error)
      toast.error(error?.message || "Password change failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Current Password</label>
            <Input 
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                currentPassword: e.target.value
              }))}
            />
          </div>
          <div>
            <label className="block mb-2">New Password</label>
            <Input 
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                newPassword: e.target.value
              }))}
            />
          </div>
          <div>
            <label className="block mb-2">Confirm New Password</label>
            <Input 
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm();
                setCurrentView('overview');
              }}
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={()=>setConfirm(true)} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" /> {isLoading ? "Updating..." : "Change Password"}
            </Button>
          </div>
<ConfirmModal
isOpen={isConfirm}
message='Are you sure want change password'
onCancel={()=>setConfirm(false)}
onConfirm={handlePasswordChange}
/>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChangePassword;
