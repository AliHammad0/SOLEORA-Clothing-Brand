
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Unable to load profile:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mb-6 text-gray-500">
            Please log in to view your profile information.
          </p>

          <Link
            to="/login"
            className="inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const fullName =
    [user.firstname, user.lastname].filter(Boolean).join(" ") ||
    user.name ||
    user.fullName ||
    "Customer";

  const email = user.email || "Not provided";
  const phone = user.phone || user.phoneNumber || "Not provided";
  const address = user.address || "Not provided";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="bg-black px-6 py-10 text-center text-white">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold uppercase text-black">
              {fullName.charAt(0)}
            </div>

            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="mt-2 text-sm text-gray-300">{email}</p>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Personal Information
            </h2>

            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="mt-1 font-medium text-gray-900">
                  {fullName}
                </p>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="mt-1 break-words font-medium text-gray-900">
                  {email}
                </p>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="mt-1 font-medium text-gray-900">
                  {phone}
                </p>
              </div>

              <div className="pb-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="mt-1 font-medium text-gray-900">
                  {address}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="flex-1 rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                Continue Shopping
              </Link>

              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
