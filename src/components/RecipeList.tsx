import React from 'react';
import { RecipeWithMatch } from '../types';
import RecipeCard from './RecipeCard';

interface RecipeListProps {
  recipes: RecipeWithMatch[];
  onRecipeClick: (recipe: RecipeWithMatch) => void;
  isLoading: boolean;
  error: string | null;
}

const RecipeList: React.FC<RecipeListProps> = ({ 
  recipes, 
  onRecipeClick, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your perfect cocktails...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Oops! Something went wrong</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No cocktails found</div>
        <p className="text-gray-600">
          Try adding more ingredients or different combinations
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.cocktail.idDrink}
          cocktail={recipe.cocktail}
          matchPercentage={recipe.matchPercentage}
          onClick={() => onRecipeClick(recipe)}
        />
      ))}
    </div>
  );
};

export default RecipeList; 