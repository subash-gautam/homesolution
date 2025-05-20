import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { RootState } from '../store';
import type { Category } from '../types';
import axios from 'axios';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../store/slices/categorySlice';
import { AppDispatch } from '../store';
import ImageUpload from '../components/CommonUitilty/ImageUpload';
import { toast } from 'react-toastify';


interface CategoryFormData {
  name: string;
  image?: string;
}

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading } = useSelector(
    (state: RootState) => state.categories
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    image: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData__ = new FormData();
    formData__.append('name', formData.name);

    if (selectedImageFile) {
      formData__.append('CategoryImage', selectedImageFile); // actual file object
    }

    // 
    try {
      if (editingCategory) {
        const response = await axios.put(
          `http://localhost:3000/api/categories/${editingCategory.id}`,
          formData__,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        if(response.status === 200) {
          toast.success('Category updated successfully');
        }
        dispatch(fetchCategories());
      } else {
        const response = await axios.post(
          'http://localhost:3000/api/categories',
          formData__,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        if (response.status === 201) {
          toast.success('Category created successfully');
        }
        dispatch(fetchCategories());
      }
  
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', image: '' });
      setSelectedImageFile(null);
    } catch (error: any) {
      console.error('Error creating category:', error);
      // alert(error.response?.data?.error || error.message);
    }


  };


  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await dispatch(deleteCategory(categoryId));
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
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="overflow-hidden transition duration-200 ease-in-out bg-white rounded-lg shadow-sm shadow hover:bg-blue-50 hover:shadow-lg"
          >
            <div className="h-48 overflow-hidden">
              {category.image ? (
                <img
                  src={`http://localhost:3000/uploads/${category.image}`}
                  alt={category.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setFormData({
                        name: category.name,
                        image: category.image,
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-semibold">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUpload
                currentImage={formData.image}
                onImageSelect={(file, previewUrl) => {
                  setSelectedImageFile(file);
                  setFormData({ ...formData, image: previewUrl });
                }}
              />

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

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                    setFormData({
                      name: '',
                      image: '',
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
                  {editingCategory ? 'Update' : 'Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

