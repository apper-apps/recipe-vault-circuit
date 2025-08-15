import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useCategories } from "@/hooks/useCategories";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const CategoriesPage = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory, loadCategories } = useCategories();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", color: "#E85D04" });

  const predefinedColors = [
    "#E85D04", "#DC2F02", "#FFBA08", "#43A047", "#1976D2",
    "#9C27B0", "#FF5722", "#607D8B", "#795548", "#F44336"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.Id, formData);
        toast.success("Category updated successfully!");
        setEditingCategory(null);
      } else {
        await createCategory(formData);
        toast.success("Category added successfully!");
        setShowAddForm(false);
      }
      setFormData({ name: "", color: "#E85D04" });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color });
    setShowAddForm(true);
  };

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory(category.Id);
        toast.success("Category deleted successfully!");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({ name: "", color: "#E85D04" });
  };

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><Error message={error} onRetry={loadCategories} /></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Recipe Categories
            </h1>
            <p className="text-gray-600 mt-1">
              Organize your recipes with custom categories
            </p>
          </div>
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <ApperIcon name="Plus" size={18} />
              Add Category
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Italian, Desserts, Quick Meals"
                  required
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color ? "border-gray-400 scale-110" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="mt-2 w-16 h-8 rounded border border-gray-300"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit">
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <Empty 
            title="No categories yet"
            message="Create your first category to help organize your recipes!"
            showAddButton={false}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.Id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 capitalize">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.count || 0} recipes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-1 text-gray-400 hover:text-error transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;