import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAppDispatch } from "../store";
import type { RootState } from "../store";
import type { Category, Service } from "../types";
import apiClient from "../api/apiClient";
import ImageUpload from "../components/CommonUitilty/ImageUpload";
import { toast } from "react-toastify";

import {
  fetchServices,
  addService,
  updateService,
  deleteService,
} from "../store/slices/serviceSlice";

interface ServiceFormData {
  name: string;
  description: string;
  categoryId: number;
  minimumCharge: number;
  avgRatePerHr: number;
}

const Services = () => {
  const dispatch = useAppDispatch();
  const { services, isLoading } = useSelector((state: RootState) => state.services);
  const { categories } = useSelector((state: RootState) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    categoryId: 0,
    minimumCharge: 0,
    avgRatePerHr: 0,
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("categoryId", String(formData.categoryId));
    formDataToSend.append("minimumCharge", String(formData.minimumCharge));
    formDataToSend.append("avgRatePerHr", String(formData.avgRatePerHr));

    if (selectedImageFile) {
      formDataToSend.append("serviceImg", selectedImageFile); // same key as backend expects
    }

    try {
      if (editingService && typeof editingService.id === "number") {
        const response = await apiClient.put(`/services/${editingService.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 200) {
          toast.success("Service updated successfully");
        }
      } else {
        const res = await apiClient.post("/services", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status === 201) {
          toast.success("Service added successfully");
        }
      }

      dispatch(fetchServices());
      setIsModalOpen(false);
      setEditingService(null);
      resetForm();
      setSelectedImageFile(null);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: 0,
      minimumCharge: 0,
      avgRatePerHr: 0,
    });
  };

  const handleDeleteService = (serviceId: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      dispatch(deleteService(serviceId)).then(() => dispatch(fetchServices()));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Min Charge
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Avg Rate/hr
              </th>

              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="transition duration-200 ease-in-out bg-white rounded-lg shadow-sm hover:bg-blue-50 hover:shadow-lg">
                <td className="max-w-xs px-6 py-4 break-words">
                  <div className="text-sm font-medium text-gray-900">
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {service.service_image ? (
                    <img
                      src={`http://localhost:3000/uploads/${service.service_image}`}
                      alt={service.name}
                      className="object-cover w-12 h-12 rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {service.category
                    ? service.category.name
                    : categories.find((c) => c.id === service.categoryId)?.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  NPR {service.minimumCharge}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  NPR {service.avgRatePerHr} /hr
                </td>

                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setFormData({
                          name: service.name,
                          description: service.description,
                          categoryId: service.categoryId,
                          minimumCharge: service.minimumCharge,
                          avgRatePerHr: service.avgRatePerHr,
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Min Charge
                </label>
                <input
                  type="number"
                  value={formData.minimumCharge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumCharge: parseFloat(e.target.value),
                    })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Avg Rate/hr
                </label>
                <input
                  type="number"
                  value={formData.avgRatePerHr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      avgRatePerHr: parseFloat(e.target.value),
                    })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <ImageUpload
                  currentImage={editingService?.service_image || ""}
                  onImageSelect={(file, previewUrl) => {
                    setSelectedImageFile(file);
                    // Optional: show preview
                  }}
                />
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingService(null);
                    setFormData({
                      name: "",
                      description: "",
                      categoryId: 0,
                      minimumCharge: 0,
                      avgRatePerHr: 0,
                    });
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingService ? "Update" : "Add"} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
