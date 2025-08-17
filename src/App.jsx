import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/components/pages/LoginPage";
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <RecipesPage />
              </ProtectedRoute>
            } />
            <Route path="/add-recipe" element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            } />
            <Route path="/recipe/:id" element={
              <ProtectedRoute>
                <RecipeDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            } />
            <Route path="/shopping-list" element={
              <ProtectedRoute>
                <ShoppingListPage />
              </ProtectedRoute>
            } />
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