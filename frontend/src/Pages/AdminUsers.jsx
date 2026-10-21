
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  MailCheck,
  MailWarning,
  Pencil,
  Trash2,
  X,
  Save,
  LoaderCircle,
} from "lucide-react";

const API_URL =
  "https://soleora-clothing-brand-backend.vercel.app/api/v1/users";

const initialForm = {
  firstname: "",
  lastname: "",
  email: "",
  isAdmin: false,
  isActive: true,
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Users load nahi ho sake.");
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      setError(err.message || "Users load karte waqt error aaya.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) =>
      [
        user.firstname,
        user.lastname,
        user.email,
        user._id,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [users, search]);

  const verifiedCount = users.filter(
    (user) => user.isEmailVerified === true
  ).length;

  const activeCount = users.filter(
    (user) => user.isActive !== false
  ).length;

  const openEdit = (user) => {
    setNotice("");
    setEditingUser(user);
    setForm({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      isAdmin: Boolean(user.isAdmin),
      isActive: user.isActive !== false,
    });
  };

  const closeEdit = () => {
    if (saving) return;
    setEditingUser(null);
    setForm(initialForm);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingUser) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: form.firstname.trim(),
          lastname: form.lastname.trim(),
          email: form.email.trim(),
          isAdmin: form.isAdmin,
          isActive: form.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "User update nahi hua.");
      }

      setEditingUser(null);
      setForm(initialForm);
      setNotice("User successfully update ho gaya.");
      await fetchUsers();
    } catch (err) {
      setError(err.message || "User update karte waqt error aaya.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const name =
      `${user.firstname || ""} ${user.lastname || ""}`.trim() ||
      user.email ||
      "this user";

    const confirmed = window.confirm(
      `Kya aap ${name} ko permanently delete karna chahte hain?`
    );

    if (!confirmed) return;

    setDeletingId(user._id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${user._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "User delete nahi hua.");
      }

      setUsers((previous) =>
        previous.filter((item) => item._id !== user._id)
      );
      setNotice("User successfully delete ho gaya.");
    } catch (err) {
      setError(err.message || "User delete karte waqt error aaya.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">
              SOLEORA Admin
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Users Management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Customers ke accounts manage karein.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Users"
            value={users.length}
            icon={<Users size={21} />}
          />
          <SummaryCard
            title="Verified Emails"
            value={verifiedCount}
            icon={<MailCheck size={21} />}
          />
          <SummaryCard
            title="Unverified Emails"
            value={users.length - verifiedCount}
            icon={<MailWarning size={21} />}
          />
          <SummaryCard
            title="Active Accounts"
            value={activeCount}
            icon={<ShieldCheck size={21} />}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">All Users</h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredUsers.length} users found
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or ID..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-gray-500">
              <LoaderCircle size={22} className="animate-spin" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <Users size={35} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">No users found</p>
              <p className="mt-1 text-sm text-gray-500">
                Search change karein ya users refresh karein.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Email Verification</th>
                    <th className="px-5 py-4">Account</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const fullName =
                      `${user.firstname || ""} ${user.lastname || ""}`.trim();

                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {fullName || "Unnamed User"}
                          </p>
                          <p className="mt-1 max-w-56 truncate text-xs text-gray-400">
                            ID: {user._id}
                          </p>
                          <p className="mt-1 text-gray-500">
                            {user.email || "No email"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            active={user.isEmailVerified === true}
                            yes="Verified"
                            no="Unverified"
                          />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            active={user.isActive !== false}
                            yes="Active"
                            no="Inactive"
                          />
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              user.isAdmin
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.isAdmin ? "Admin" : "Customer"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(user)}
                              title="Edit user"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              disabled={deletingId === user._id}
                              title="Delete user"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === user._id ? (
                                <LoaderCircle
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-user-title"
              className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-5">
                <div>
                  <h2 id="edit-user-title" className="text-lg font-bold">
                    Edit User
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    User account details update karein.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={saving}
                  aria-label="Close edit form"
                  className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstname"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      First Name
                    </label>
                    <input
                      id="firstname"
                      required
                      value={form.firstname}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          firstname: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastname"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastname"
                      required
                      value={form.lastname}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          lastname: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-500"
                  />
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div>
                    <p className="text-sm font-semibold">Admin Role</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Admin access enable ya disable karein.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isAdmin}
                    onChange={(event) =>
                      setForm({ ...form, isAdmin: event.target.checked })
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div>
                    <p className="text-sm font-semibold">Active Account</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Inactive account ko disable kiya ja sakta hai.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm({ ...form, isActive: event.target.checked })
                    }
                    className="h-4 w-4 accent-black"
                  />
                </label>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeEdit}
                    disabled={saving}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <p className="text-sm text-gray-500">{title}</p>
      <span className="rounded-lg bg-gray-100 p-2 text-gray-700">
        {icon}
      </span>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const StatusBadge = ({ active, yes, no }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
      active
        ? "bg-green-100 text-green-700"
        : "bg-amber-100 text-amber-700"
    }`}
  >
    {active ? yes : no}
  </span>
);

export default AdminUsers;
