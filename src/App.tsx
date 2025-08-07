import React, { useState, useEffect } from 'react';
import { Cocktail, RecipeWithMatch } from './types';
import { 
  fetchIngredients, 
  searchCocktailsByIngredient, 
  getCocktailDetails, 
  getIngredientsFromCocktail, 
  calculateMatchPercentage 
} from './utils/api';
import IngredientInput from './components/IngredientInput';
import SelectedIngredientsList from './components/SelectedIngredientsList';
import RecipeList from './components/RecipeList';
import RecipeDetailModal from './components/RecipeDetailModal';

const App: React.FC = () => {
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeWithMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load available ingredients on component mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const ingredients = await fetchIngredients();
        setAvailableIngredients(ingredients);
      } catch (err) {
        setError('Failed to load ingredients');
      }
    };
    loadIngredients();
  }, []);

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => prev.filter(ing => ing !== ingredient));
  };

  const handleFindCocktails = async () => {
    if (selectedIngredients.length === 0) {
      setError('Please select at least one ingredient');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Search for cocktails by each ingredient
      const allCocktailLists = await Promise.all(
        selectedIngredients.map(ingredient => 
          searchCocktailsByIngredient(ingredient)
        )
      );

      // Combine and deduplicate cocktails
      const allCocktails = allCocktailLists.flat();
      const uniqueCocktails = allCocktails.filter((cocktail, index, self) => 
        index === self.findIndex(c => c.idDrink === cocktail.idDrink)
      );

      // Get detailed information for each cocktail
      const detailedCocktails = await Promise.all(
        uniqueCocktails.map(async (cocktail) => {
          const details = await getCocktailDetails(cocktail.idDrink);
          return details;
        })
      );

      // Filter out null results and calculate match percentages
      const validCocktails = detailedCocktails.filter((cocktail): cocktail is Cocktail => 
        cocktail !== null
      );

      const recipesWithMatch: RecipeWithMatch[] = validCocktails.map(cocktail => {
        const cocktailIngredients = getIngredientsFromCocktail(cocktail);
        const matchPercentage = calculateMatchPercentage(selectedIngredients, cocktailIngredients);
        
        const availableIngredients = cocktailIngredients.filter(ingredient =>
          selectedIngredients.some(selectedIng => 
            selectedIng.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(selectedIng.toLowerCase())
          )
        );

        const missingIngredients = cocktailIngredients.filter(ingredient =>
          !selectedIngredients.some(selectedIng => 
            selectedIng.toLowerCase().includes(ingredient.toLowerCase()) ||
            ingredient.toLowerCase().includes(selectedIng.toLowerCase())
          )
        );

        return {
          cocktail,
          matchPercentage,
          availableIngredients,
          missingIngredients
        };
      });

      // Filter recipes with at least 50% match and sort by match percentage
      const filteredRecipes = recipesWithMatch
        .filter(recipe => recipe.matchPercentage >= 50)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

      setRecipes(filteredRecipes);
    } catch (err) {
      setError('Failed to fetch cocktails. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipe: RecipeWithMatch) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Last Call
          </h1>
          <p className="text-gray-600">
            Find the perfect cocktail with ingredients you already have
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Ingredient Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              What ingredients do you have?
            </h2>
            
            <IngredientInput
              onAddIngredient={handleAddIngredient}
              availableIngredients={availableIngredients}
            />

            <div className="mt-4">
              <SelectedIngredientsList
                ingredients={selectedIngredients}
                onRemoveIngredient={handleRemoveIngredient}
              />
            </div>

            <div className="mt-6">
              <button
                onClick={handleFindCocktails}
                disabled={selectedIngredients.length === 0 || isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Finding Cocktails...' : 'Find Cocktails'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {recipes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Cocktails You Can Make ({recipes.length})
              </h2>
              <RecipeList
                recipes={recipes}
                onRecipeClick={handleRecipeClick}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}

          {/* Loading/Error/Empty States */}
          {!isLoading && !error && recipes.length === 0 && selectedIngredients.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <RecipeList
                recipes={[]}
                onRecipeClick={() => {}}
                isLoading={false}
                error={null}
              />
            </div>
          )}
        </div>
      </div>

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default App; 