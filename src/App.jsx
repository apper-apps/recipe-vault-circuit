import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import RecipesPage from "@/components/pages/RecipesPage";
import AddRecipePage from "@/components/pages/AddRecipePage";
import RecipeDetailPage from "@/components/pages/RecipeDetailPage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import ShoppingListPage from "@/components/pages/ShoppingListPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<RecipesPage />} />
            <Route path="/add-recipe" element={<AddRecipePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;