import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import RecipeForm from "@/components/organisms/RecipeForm";
import { useRecipes } from "@/hooks/useRecipes";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const { createRecipe, generateRecipe } = useRecipes();
  const [mode, setMode] = useState('manual'); // 'manual' or 'ai'
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleManualSubmit = async (formData) => {
    try {
      await createRecipe(formData);
      toast.success("Recipe added successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to add recipe");
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a recipe prompt");
      return;
    }

    try {
      setIsGenerating(true);
      const recipe = await generateRecipe(aiPrompt);
      setGeneratedRecipe(recipe);
      toast.success("Recipe generated successfully! Review and edit as needed.");
    } catch (error) {
      toast.error(error.message || "Failed to generate recipe");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiSubmit = async (formData) => {
    try {
      await createRecipe(formData);
      toast.success("AI-generated recipe saved successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to save recipe");
    }
  };

  const resetAiMode = () => {
    setGeneratedRecipe(null);
    setAiPrompt('');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            {mode === 'ai' ? 'AI Recipe Creator' : 'Add New Recipe'}
          </h1>
          <p className="text-gray-600">
            {mode === 'ai' 
              ? 'Generate amazing recipes using AI or create manually with detailed instructions.'
              : 'Share your favorite recipe with detailed instructions and ingredients.'
            }
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
            <Button
              variant={mode === 'manual' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setMode('manual');
                resetAiMode();
              }}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Edit3" size={16} />
              Manual
            </Button>
            <Button
              variant={mode === 'ai' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setMode('ai')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Sparkles" size={16} />
              AI Generate
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {mode === 'ai' && !generatedRecipe && (
            <div className="space-y-6 mb-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <ApperIcon name="Sparkles" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                  Generate Recipe with AI
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Describe what you want to cook and let AI create a complete recipe for you
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <FormField
                  label="Recipe Prompt"
                  name="prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., 'A healthy Mediterranean pasta with vegetables and olive oil' or 'Chocolate chip cookies that are crispy on the outside'"
                  multiline
                  rows={4}
                />
                
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <ApperIcon name="Loader2" size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Wand2" size={18} />
                        Generate Recipe
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={() => setMode('manual')}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="Edit3" size={18} />
                    Create Manually
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <ApperIcon name="Clock" size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Quick Generation</h4>
                    <p className="text-sm text-gray-600">Get a complete recipe in seconds</p>
                  </div>
                  <div className="p-4">
                    <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <ApperIcon name="ChefHat" size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Professional Quality</h4>
                    <p className="text-sm text-gray-600">Detailed ingredients and instructions</p>
                  </div>
                  <div className="p-4">
                    <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <ApperIcon name="Edit" size={20} className="text-primary" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Fully Editable</h4>
                    <p className="text-sm text-gray-600">Customize the generated recipe</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'ai' && generatedRecipe && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-success/10 rounded-full p-2 flex items-center justify-center">
                    <ApperIcon name="CheckCircle" size={20} className="text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recipe Generated!</h3>
                    <p className="text-gray-600 text-sm">Review and edit as needed before saving</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={resetAiMode}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="RotateCcw" size={16} />
                  Generate New
                </Button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <RecipeForm 
                  onSubmit={handleAiSubmit} 
                  initialData={generatedRecipe}
                />
              </div>
            </div>
          )}

          {mode === 'manual' && (
            <RecipeForm onSubmit={handleManualSubmit} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AddRecipePage;