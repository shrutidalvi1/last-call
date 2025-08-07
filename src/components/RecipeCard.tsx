import React from 'react';
import { Cocktail } from '../types';

interface RecipeCardProps {
  cocktail: Cocktail;
  matchPercentage: number;
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ cocktail, matchPercentage, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative">
        <img
          src={cocktail.strDrinkThumb}
          alt={cocktail.strDrink}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {Math.round(matchPercentage)}% match
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {cocktail.strDrink}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {matchPercentage >= 50 ? (
              <span className="text-green-600 font-medium">
                ✓ You have most ingredients!
              </span>
            ) : (
              <span className="text-orange-600 font-medium">
                ⚠ You need more ingredients
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard; 