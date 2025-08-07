# Last Call

A React application that helps users find cocktail recipes based on ingredients they already have at home. Built with TypeScript, TailwindCSS, and the CocktailDB API.

## Features

- **Ingredient Autocomplete**: Type to search and select from available ingredients
- **Multiple Ingredient Selection**: Add and remove ingredients with visual tags
- **Smart Recipe Matching**: Find cocktails where at least 50% of ingredients match
- **Detailed Recipe View**: See full ingredients, instructions, and match percentage
- **Visual Ingredient Status**: See which ingredients you have vs. need to buy
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- React 18 with TypeScript
- TailwindCSS for styling
- CocktailDB API for recipe data
- Functional components with hooks

## Project Structure

```
src/
├── components/
│   ├── IngredientInput.tsx      # Autocomplete ingredient input
│   ├── SelectedIngredientsList.tsx  # Display selected ingredients
│   ├── RecipeCard.tsx          # Individual recipe card
│   ├── RecipeList.tsx          # Grid of recipe cards
│   └── RecipeDetailModal.tsx   # Detailed recipe modal
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   └── api.ts                  # API utility functions
├── App.tsx                     # Main application component
└── index.tsx                   # Application entry point
```

## API Integration

The app uses the CocktailDB API with the following endpoints:
- `/list.php?i=list` - Get all available ingredients
- `/filter.php?i=ingredient` - Search cocktails by ingredient
- `/lookup.php?i=id` - Get detailed cocktail information

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How It Works

1. **Ingredient Selection**: Users type ingredients and select from autocomplete suggestions
2. **Recipe Search**: The app searches for cocktails containing any of the selected ingredients
3. **Match Calculation**: For each cocktail, it calculates what percentage of ingredients the user has
4. **Filtering**: Only shows cocktails where the user has at least 50% of ingredients
5. **Detailed View**: Click any cocktail to see full recipe with ingredient status

## Components

### IngredientInput
- Autocomplete input field
- Keyboard navigation support
- Click outside to close suggestions

### SelectedIngredientsList
- Displays selected ingredients as removable tags
- Empty state message

### RecipeCard
- Shows cocktail image, name, and match percentage
- Visual indicators for ingredient availability

### RecipeList
- Grid layout for recipe cards
- Loading, error, and empty states

### RecipeDetailModal
- Full recipe details
- Visual distinction between available and missing ingredients
- Instructions and larger image

## Future Enhancements

- Save favorite recipes
- Filter by alcohol type
- Dietary restrictions
- Share recipes
- Print-friendly recipe cards 