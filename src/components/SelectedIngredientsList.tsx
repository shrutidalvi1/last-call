import React from 'react';

interface SelectedIngredientsListProps {
  ingredients: string[];
  onRemoveIngredient: (ingredient: string) => void;
}

const SelectedIngredientsList: React.FC<SelectedIngredientsListProps> = ({ 
  ingredients, 
  onRemoveIngredient 
}) => {
  if (ingredients.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">
        No ingredients selected yet. Start typing to add ingredients!
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ingredients.map((ingredient, index) => (
        <div
          key={`${ingredient}-${index}`}
          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
        >
          <span>{ingredient}</span>
          <button
            onClick={() => onRemoveIngredient(ingredient)}
            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            aria-label={`Remove ${ingredient}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedIngredientsList; 