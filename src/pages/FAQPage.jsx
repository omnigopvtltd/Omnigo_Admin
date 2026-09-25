import React, { useState } from "react";
import { useFAQs, useFAQMutations } from "../hooks/useCMS";
import FAQModal from "../components/cms/FAQModal";

export default function FAQsPage() {
  const [params, setParams] = useState({ page: 1, limit: 10, role: "", search: "" });
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useFAQs(params);
  const { createFAQ, updateFAQ, deleteFAQ } = useFAQMutations();

  const handleSave = (formData) => {
    if (selectedFAQ) {
      updateFAQ.mutate({ id: selectedFAQ._id, data: formData });
    } else {
      createFAQ.mutate(formData);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <button
          onClick={() => { setSelectedFAQ(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add FAQ
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search question or answer..."
          className="border p-2 rounded w-64"
          onChange={(e) => setParams({ ...params, search: e.target.value })}
        />
        <select
          onChange={(e) => setParams({ ...params, role: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="rider">Rider</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>

      {/* FAQs Table */}
      {isLoading ? (
        <p>Loading FAQs...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Role</th>
                <th className="p-3">Question</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((faq) => (
                <tr key={faq._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{faq.category}</td>
                  <td className="p-3 uppercase text-xs font-semibold">{faq.targetRole}</td>
                  <td className="p-3">{faq.question}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => { setSelectedFAQ(faq); setIsModalOpen(true); }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFAQ.mutate(faq._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FAQModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={selectedFAQ}
      />
    </div>
  );
}