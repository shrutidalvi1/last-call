import React from 'react';
import { RecipeWithMatch } from '../types';
import { getIngredientsFromCocktail } from '../utils/api';

interface RecipeDetailModalProps {
  recipe: RecipeWithMatch | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ 
  recipe, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !recipe) return null;

  const cocktail = recipe.cocktail;
  const ingredients = getIngredientsFromCocktail(cocktail);
  const userIngredients = recipe.availableIngredients;

  const getIngredientStatus = (ingredient: string) => {
    const isAvailable = userIngredients.some(userIng => 
      userIng.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(userIng.toLowerCase())
    );
    return isAvailable ? 'available' : 'missing';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{cocktail.strDrink}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Match percentage:</span>
                  <span className="text-lg font-bold text-green-600">
                    {Math.round(recipe.matchPercentage)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Ingredients</h3>
              <div className="space-y-2 mb-6">
                {ingredients.map((ingredient, index) => {
                  const status = getIngredientStatus(ingredient);
                  return (
                    <div
                      key={index}
                      className={`flex items-center p-2 rounded ${
                        status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span className="mr-2">
                        {status === 'available' ? '✓' : '✗'}
                      </span>
                      <span className="font-medium">{ingredient}</span>
                    </div>
                  );
                })}
              </div>

              <h3 className="text-lg font-semibold mb-3 text-gray-800">Instructions</h3>
              <p className="text-gray-700 leading-relaxed">
                {cocktail.strInstructions || 'No instructions available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal; 