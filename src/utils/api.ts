import { Cocktail, CocktailListItem, Ingredient, CocktailDBResponse } from '../types';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const fetchIngredients = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/list.php?i=list`);
    const data: CocktailDBResponse<Ingredient> = await response.json();
    
    if (data.drinks) {
      return data.drinks.map(drink => drink.strIngredient1);
    }
    return [];
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
};

export const searchCocktailsByIngredient = async (ingredient: string): Promise<CocktailListItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data: CocktailDBResponse<CocktailListItem> = await response.json();
    
    return data.drinks || [];
  } catch (error) {
    console.error('Error searching cocktails by ingredient:', error);
    return [];
  }
};

export const getCocktailDetails = async (id: string): Promise<Cocktail | null> => {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data: CocktailDBResponse<Cocktail> = await response.json();
    
    return data.drinks ? data.drinks[0] : null;
  } catch (error) {
    console.error('Error fetching cocktail details:', error);
    return null;
  }
};

export const getIngredientsFromCocktail = (cocktail: Cocktail): string[] => {
  const ingredients: string[] = [];
  
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}` as keyof Cocktail] as string;
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.trim());
    }
  }
  
  return ingredients;
};

export const calculateMatchPercentage = (userIngredients: string[], cocktailIngredients: string[]): number => {
  if (cocktailIngredients.length === 0) return 0;
  
  const userIngredientsLower = userIngredients.map(ing => ing.toLowerCase());
  const cocktailIngredientsLower = cocktailIngredients.map(ing => ing.toLowerCase());
  
  const matchingIngredients = cocktailIngredientsLower.filter(ingredient =>
    userIngredientsLower.some(userIng => 
      userIng.includes(ingredient) || ingredient.includes(userIng)
    )
  );
  
  return (matchingIngredients.length / cocktailIngredients.length) * 100;
}; 