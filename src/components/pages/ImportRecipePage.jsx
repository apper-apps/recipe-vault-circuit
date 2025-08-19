import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import { useRecipes } from '@/hooks/useRecipes';

function ImportRecipePage() {
  const navigate = useNavigate();
  const { importFromPinterest } = useRecipes();
  
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewRecipe, setPreviewRecipe] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleExtractRecipe = async () => {
    if (!url.trim()) {
      toast.error('Please enter a Pinterest URL');
      return;
    }

    if (!url.includes('pinterest.com')) {
      toast.error('Please enter a valid Pinterest URL');
      return;
    }

    setLoading(true);
    try {
      // Simulate recipe extraction from Pinterest URL
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted recipe data
      const extractedRecipe = {
        title: 'Delicious Chocolate Chip Cookies',
        description: 'Soft and chewy chocolate chip cookies that are perfect for any occasion. These cookies have the perfect balance of sweetness and texture.',
        ingredients: [
          '2 1/4 cups all-purpose flour',
          '1 tsp baking soda',
          '1 tsp salt',
          '1 cup butter, softened',
          '3/4 cup granulated sugar',
          '3/4 cup brown sugar',
          '2 large eggs',
          '2 tsp vanilla extract',
          '2 cups chocolate chips'
        ],
        instructions: [
          'Preheat oven to 375°F (190°C)',
          'Mix flour, baking soda, and salt in a bowl',
          'Cream butter and sugars until light and fluffy',
          'Beat in eggs and vanilla',
          'Gradually blend in flour mixture',
          'Stir in chocolate chips',
          'Drop by rounded tablespoons onto ungreased cookie sheets',
          'Bake 9-11 minutes or until golden brown',
          'Cool on baking sheet for 2 minutes; remove to wire rack'
        ],
        prepTime: '15 minutes',
        cookTime: '10 minutes',
        servings: 48,
        difficulty: 'Easy',
        categoryId: 3,
        sourceUrl: url,
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop'
      };

      setPreviewRecipe(extractedRecipe);
      toast.success('Recipe extracted successfully!');
    } catch (error) {
      toast.error('Failed to extract recipe from Pinterest URL');
    } finally {
      setLoading(false);
    }
  };

  const handleImportRecipe = async () => {
    if (!previewRecipe) return;

    setImporting(true);
    try {
      await importFromPinterest(url);
      toast.success('Recipe imported successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to import recipe');
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setPreviewRecipe(null);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ApperIcon name="ArrowLeft" size={18} />
            Back to Recipes
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Import from Pinterest
            </h1>
            <p className="text-gray-600 mt-1">
              Paste a Pinterest recipe URL to import it to your collection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* URL Input Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ApperIcon name="Link" size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-display font-semibold">
                  Pinterest URL
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pinterest-url">Recipe URL</Label>
                  <Input
                    id="pinterest-url"
                    type="url"
                    placeholder="https://www.pinterest.com/pin/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Paste the full Pinterest URL of the recipe you want to import
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleExtractRecipe}
                    disabled={loading || !url.trim()}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={18} className="animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Search" size={18} />
                        Extract Recipe
                      </>
                    )}
                  </Button>
                  
                  {previewRecipe && (
                    <Button
                      onClick={handleReset}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <ApperIcon name="RotateCcw" size={18} />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-6">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                <ApperIcon name="Info" size={18} className="text-info" />
                How to Import
              </h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">1</span>
                  Find a recipe on Pinterest that you'd like to import
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">2</span>
                  Copy the full Pinterest URL from your browser
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">3</span>
                  Paste the URL in the field above and click "Extract Recipe"
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">4</span>
                  Review the extracted recipe and click "Import Recipe"
                </li>
              </ol>
            </Card>
          </div>

          {/* Recipe Preview Section */}
          <div>
            {loading && (
              <Card className="p-8">
                <Loading />
                <p className="text-center text-gray-600 mt-4">
                  Extracting recipe from Pinterest...
                </p>
              </Card>
            )}

            {previewRecipe && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <ApperIcon name="Eye" size={24} className="text-success" />
                  </div>
                  <h2 className="text-xl font-display font-semibold">
                    Recipe Preview
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Recipe Image */}
                  {previewRecipe.image && (
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={previewRecipe.image}
                        alt={previewRecipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Recipe Title and Description */}
                  <div>
                    <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                      {previewRecipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {previewRecipe.description}
                    </p>
                  </div>

                  {/* Recipe Meta */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Prep Time</p>
                      <p className="font-semibold">{previewRecipe.prepTime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Cook Time</p>
                      <p className="font-semibold">{previewRecipe.cookTime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Servings</p>
                      <p className="font-semibold">{previewRecipe.servings}</p>
                    </div>
                  </div>

                  {/* Ingredients Preview */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ingredients</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {previewRecipe.ingredients.slice(0, 5).map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {ingredient}
                        </li>
                      ))}
                      {previewRecipe.ingredients.length > 5 && (
                        <li className="text-gray-400 italic">
                          +{previewRecipe.ingredients.length - 5} more ingredients...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Import Button */}
                  <Button
                    onClick={handleImportRecipe}
                    disabled={importing}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {importing ? (
                      <>
                        <ApperIcon name="Loader2" size={18} className="animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Download" size={18} />
                        Import Recipe
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {!loading && !previewRecipe && (
              <Card className="p-8 text-center">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ApperIcon name="Search" size={32} className="text-gray-400" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">
                  Ready to Import
                </h3>
                <p className="text-gray-600 text-sm">
                  Enter a Pinterest URL above to extract and preview the recipe
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ImportRecipePage;