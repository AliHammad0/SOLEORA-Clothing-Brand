
import React, { useState } from "react";
import { Save, Settings } from "lucide-react";

const defaultSettings = {
  storeName: "SOLEORA",
  supportEmail: "",
  currency: "PKR",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      return {
        ...defaultSettings,
        ...JSON.parse(localStorage.getItem("soleora-settings") || "{}"),
      };
    } catch {
      return defaultSettings;
    }
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const handleSave = (e) => {
    e.preventDefault();

    try {
      localStorage.setItem(
        "soleora-settings",
        JSON.stringify(settings)
      );
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Unable to save settings in this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store preferences
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 border-b pb-4">
          <Settings size={24} />
          <h2 className="text-lg font-semibold">Store Settings</h2>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Store Name
          </label>
          <input
            name="storeName"
            value={settings.storeName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Support Email
          </label>
          <input
            type="email"
            name="supportEmail"
            value={settings.supportEmail}
            onChange={handleChange}
            placeholder="support@example.com"
            className="w-full rounded-lg border p-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Currency
          </label>
          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 outline-none focus:border-black"
          >
            <option value="PKR">PKR - Pakistani Rupee</option>
            <option value="USD">USD - US Dollar</option>
          </select>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white"
        >
          <Save size={18} />
          Save Settings
        </button>

        {message && (
          <p className="text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
