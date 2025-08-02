import React, { useState, useEffect } from "react";
import Header from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";
import { user_block_unbloack, get_users } from "../../services/Admin/user.service";
import Loading from "../../components/Loading";
import { Snackbar, Alert } from "@mui/material";
import { ConfirmationModal } from "@/components/ConfirmModal";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import debounce from "@/Utils/debouce";
import { IUser } from "@/Interfaces/interfaces";


const UserManagement: React.FC = () => {
  const [filterText, setFilterText] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    userId: "",
    isBlocked: false,
    userName: "",
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await get_users(currentPage, itemsPerPage, filterText);
        if (response.success) {
          setUsers(response.users);
          setTotalUsers(response.totalUsers);
          setTotalPages(Math.ceil(response.totalUsers / itemsPerPage));
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch users",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, filterText]);

  const showConfirmation = (user: IUser) => {
    setConfirmationModal({
      isOpen: true,
      userId: user._id,
      isBlocked: !user.isBlocked,
      userName: user.name,
    });
  };

  const handleBlock = async () => {
    try {
      const { userId, isBlocked } = confirmationModal;
      setIsLoading(true);
      const response = await user_block_unbloack(userId, isBlocked);
      
      if (response?.success) {
        setUsers((prevUsers:IUser[]) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked } : user
          )
        );
        setSnackbar({
          open: true,
          message: response.message || 
                  `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: response?.message || "Failed to update user status",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating user status",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
      setConfirmationModal({ ...confirmationModal, isOpen: false });
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = debounce((value:string) => {
    setFilterText(value);
    setCurrentPage(1); // Reset to first page when searching
  },400);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#171730] text-white transition-all pt-14">
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarExpanded(expanded)}
        />
  <main
  className={`p-3 md:p-5 transition-all duration-300 ${
    isSidebarExpanded ? "ml-16 md:ml-64" : "ml-16"
  }`}
>
  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5">User Management</h2>
  <div className="flex justify-between mb-4 md:mb-5">
    <input
      type="text"
      placeholder="Search users..."
      defaultValue={filterText}
      onChange={(e) => handleSearch(e.target.value)}
      className="p-2 rounded bg-[#2A2A3C] text-white placeholder-gray-400 w-full md:w-64"
    />
  </div>
  
  {isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#2A2A3C]">
              <th className="p-2 md:p-3 text-left hidden sm:table-cell">Profile</th>
              <th className="p-2 md:p-3 text-left">Name</th>
              <th className="p-2 md:p-3 text-left hidden md:table-cell">Email</th>
              <th className="p-2 md:p-3 text-left hidden lg:table-cell">Google User</th>
              <th className="p-2 md:p-3 text-left">Status</th>
              <th className="p-2 md:p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b border-[#2A2A3C] hover:bg-[#2A2A3C]">
                  <td className="p-2 md:p-3 hidden sm:table-cell">
                    <img
                      src={user.profile_image?user.profile_image:'/default_profile.png'}
                      alt={user.name}
                      className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
                    />
                  </td>
                  <td className="p-2 md:p-3 truncate max-w-[100px] md:max-w-none">
                    {user.name}
                  </td>
                  <td className="p-2 md:p-3 hidden md:table-cell truncate max-w-[150px] lg:max-w-none">
                    {user.email}
                  </td>
                  <td className="p-2 md:p-3 hidden lg:table-cell">
                    <span
                      className={`px-2 py-1 rounded text-xs md:text-sm text-white ${
                        user.isGoogleUser ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.isGoogleUser ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs md:text-sm text-white ${
                        user.isBlocked ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-2 md:p-3">
                    <button
                      onClick={() => showConfirmation(user)}
                      className={`px-3 py-1 md:px-4 md:py-2 rounded-md font-semibold text-xs md:text-base ${
                        user.isBlocked 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4 md:mt-5 flex justify-center">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size={window.innerWidth < 768 ? "small" : "large"}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white',
                },
                '& .MuiPaginationItem-page.Mui-selected': {
                  backgroundColor: '#3b82f6',
                  color: 'white',
                },
              }}
            />
          </Stack>
        </div>
      )}
    </>
  )}
</main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={handleBlock}
        title={`${confirmationModal.isBlocked ? "Block" : "Unblock"} User`}
        description={`Are you sure you want to ${confirmationModal.isBlocked ? "block" : "unblock"} ${confirmationModal.userName}?`}
        confirmText={confirmationModal.isBlocked ? "Block" : "Unblock"}
        variant={confirmationModal.isBlocked ? "destructive" : "default"}
      />

      {/* Snackbar for Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserManagement;