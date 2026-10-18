import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-semibold">Please Login</h1>
        <p className="mt-2 text-gray-500">
          Login to view your profile
        </p>
        <Link
          to="/login"
          className="mt-5 bg-black px-6 py-3 text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[60vh] max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-semibold">My Profile</h1>
      <p className="mt-2 text-gray-500">
        Manage your SOLEORA account.
      </p>

      <div className="mt-8 space-y-5 border border-gray-200 p-6">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="mt-1 font-medium">
            {[user.firstname, user.lastname].filter(Boolean).join(" ") ||
              user.name ||
              "Not available"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="mt-1 font-medium">
            {user.email || "Not available"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;