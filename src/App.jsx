import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SignupPage from "@/components/pages/SignupPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import RecipeDetailPage from "@/components/pages/RecipeDetailPage";
import LoginPage from "@/components/pages/LoginPage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import RecipesPage from "@/components/pages/RecipesPage";
import AddRecipePage from "@/components/pages/AddRecipePage";
import ShoppingListPage from "@/components/pages/ShoppingListPage";
import AddUserPage from "@/components/pages/AddUserPage";
import Layout from "@/components/organisms/Layout";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
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
            <Route path="/add-user" element={
              <ProtectedRoute>
                <AddUserPage />
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