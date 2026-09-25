import React, { useState } from "react";
import { useTerms, useSaveTerms } from "../hooks/useCMS";

export default function TermsPage() {
  const { data, isLoading } = useTerms();
  const saveTermsMutation = useSaveTerms();

  const [activeRole, setActiveRole] = useState("user");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Instructions to follow");

  // Load selected role content into form state
  const currentTerms = data?.data?.find((t) => t.targetRole === activeRole);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    const item = data?.data?.find((t) => t.targetRole === role);
    setContent(item ? item.content : "");
    setTitle(item ? item.title : "Instructions to follow");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTermsMutation.mutate({
      targetRole: activeRole,
      title,
      content,
      version: (currentTerms?.version || 1.0) + 0.1,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Terms & Conditions Management</h1>

      {/* Role Tabs */}
      <div className="flex border-b mb-6">
        {["user", "rider", "vendor"].map((role) => (
          <button
            key={role}
            onClick={() => handleRoleChange(role)}
            className={`px-6 py-2 capitalize border-b-2 font-medium ${
              activeRole === role ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
            }`}
          >
            {role} Terms
          </button>
        ))}
      </div>

      {isLoading ? (
        <p>Loading terms...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Terms Clauses / Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="1. Clause 1&#10;Enter details here...&#10;&#10;2. Clause 2&#10;Enter details here..."
              className="w-full border p-2 rounded mt-1 h-96 font-mono text-sm"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <span className="text-xs text-gray-500">
              Current Version: {currentTerms?.version || "1.0"}
            </span>
            <button
              type="submit"
              disabled={saveTermsMutation.isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saveTermsMutation.isLoading ? "Saving..." : "Save Terms & Conditions"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}