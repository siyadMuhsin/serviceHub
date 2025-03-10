import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Header from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";
import { user_block_unbloack, get_users } from "../../services/Admin/user.service";
import Loading from "../../components/Loading";
import { Snackbar, Alert } from "@mui/material";

const UserManagement: React.FC = () => {
  const [filterText, setFilterText] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await get_users();
      if (response.success) {
        setUsers(response.users);
      }
    };
    fetchUsers();
  }, []);

  const handleBlock = async (id: string, status: boolean) => {
    try {
      const response = await user_block_unbloack(id, status);
      if (response?.success) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        setUsers((prevUsers: any) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, isBlocked: status } : user
          )
        );
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
    }
  };

  const columns = [
    {
      name: "Profile",
      selector: (row: any) => row.avatar,
      cell: (row: any) => (
        <img
          src={row.avatar}
          alt={row.name}
          className="w-12 h-12 object-cover rounded-full"
        />
      ),
      width: "80px",
    },
    {
      name: "Name",
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
    },
    {
      name: "googleUser",
      selector: (row: any) => row.isGoogleUser,
      cell: (row: any) => (
        <span
          className={`px-2 py-1 rounded text-sm text-white ${
            row.isGoogleUser ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {row.isGoogleUser ? "Yes" : "No"}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleBlock(row._id, !row.isBlocked)}
            className={`px-4 py-2 rounded-md font-semibold ${
              row.isBlocked ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {row.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ),
      width: "200px",
    },
  ];

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
          <h2 className="text-2xl font-bold mb-5">User Management</h2>
          <div className="flex justify-between mb-5">
            <input
              type="text"
              placeholder="Search users..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="p-2 rounded bg-[#2A2A3C] text-white placeholder-gray-400"
            />
          </div>
          {isLoading && <Loading />}
          <div className="overflow-auto max-h-[calc(100vh-200px)]">
            <DataTable
              columns={columns}
              data={users.filter((user: any) =>
                user.name.toLowerCase().includes(filterText.toLowerCase())
              )}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 20, 30]}
              highlightOnHover
              customStyles={customStyles}
            />
          </div>
        </main>
      </div>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
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

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#2A2A3C",
      color: "#FFFFFF",
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
  cells: {
    style: {
      backgroundColor: "#1E1E2F",
      color: "#FFFFFF",
      fontSize: "14px",
    },
  },
  rows: {
    style: {
      backgroundColor: "#1E1E2F",
      "&:hover": {
        backgroundColor: "#2A2A3C",
      },
    },
  },
};

export default UserManagement;
