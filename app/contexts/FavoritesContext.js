"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => {
	// CONTEXT HERE SIMPLIFY IMPORT IN PAGE WITH EASIER SYNTAX
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error("useFavorites must be used within a FavoritesProvider");
	}
	return context;
};

// THE CONTEXT PROVIDER OF VALUES & METHODS AVAIL TO ENTIRE APP
export const FavoritesProvider = ({ children }) => {
	// CONTEXT STATE VARS FOR THE ACTUAL FAVORITES & IF DATE IS LOADING
	const [favorites, setFavorites] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// LOAD FAVORITES FROM LOCALSTORAGE ON MOUNT
	useEffect(() => {
		try {
			const savedFavorites = localStorage.getItem("recipe-favorites");
			if (savedFavorites) {
				const parsedFavorites = JSON.parse(savedFavorites);
				setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
			}
		} catch (error) {
			console.error("Error loading favorites from localStorage:", error);
			setFavorites([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// SAVE FAVORITES TO LOCALSTORAGE WHENEVER FAVORITES CHANGE
	useEffect(() => {
		if (!isLoading) {
			try {
				localStorage.setItem("recipe-favorites", JSON.stringify(favorites));
			} catch (error) {
				console.error("Error saving favorites to localStorage:", error);
			}
		}
	}, [favorites, isLoading]);

	// WHEN BUTTON IS CLICKED ON RECIPE NOT IN FAVORTIES
	const addToFavorites = (recipe) => {
		setFavorites((prevFavorites) => {
			// HANDLE IF RECIPE IS ALREADY IN FAVORITES
			const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === recipe.id);

			if (isAlreadyFavorite) {
				console.warn("Recipe is already in favorites");
				return prevFavorites;
			}

			// CREATE A CLEAN RECIPE OBJECT WITH ONLY NECESSARY DATA
			const cleanRecipe = {
				id: recipe.id,
				title: recipe.title,
				image: recipe.image,
				readyInMinutes: recipe.readyInMinutes,
				servings: recipe.servings,
				healthScore: recipe.healthScore,
				summary: recipe.summary,
				sourceUrl: recipe.sourceUrl,
				spoonacularSourceUrl: recipe.spoonacularSourceUrl,
				cuisines: recipe.cuisines || [],
				dishTypes: recipe.dishTypes || [],
				diets: recipe.diets || [],
				occasions: recipe.occasions || [],
				extendedIngredients: recipe.extendedIngredients || [],
				analyzedInstructions: recipe.analyzedInstructions || [],
				instructions: recipe.instructions,
				nutrition: recipe.nutrition,
				vegetarian: recipe.vegetarian,
				vegan: recipe.vegan,
				glutenFree: recipe.glutenFree,
				dairyFree: recipe.dairyFree,
				ketogenic: recipe.ketogenic,
				sustainable: recipe.sustainable,
				lowFodmap: recipe.lowFodmap,
				weightWatcherSmartPoints: recipe.weightWatcherSmartPoints,
				gaps: recipe.gaps,
				preparationMinutes: recipe.preparationMinutes,
				cookingMinutes: recipe.cookingMinutes,
				aggregateLikes: recipe.aggregateLikes,
				spoonacularScore: recipe.spoonacularScore,
				creditsText: recipe.creditsText,
				license: recipe.license,
				sourceName: recipe.sourceName,
				pricePerServing: recipe.pricePerServing,
				cheap: recipe.cheap,
				popular: recipe.popular,
				sustainable: recipe.sustainable,
				dateAdded: new Date().toISOString(),
			};

			return [...prevFavorites, cleanRecipe];
		});
	};

	// CLEAR ALL, CONVENIENCE FUNCTION
	const clearAllFavorites = () => {
		// EASY WAYS ARE USUSALL THE BEST WAYS :D
		setFavorites([]);
	};

	// WHEN BUTTON IS CLICKED ON RECIPE ALREADY IN FAVORTIES
	const removeFromFavorites = (recipeId) => {
		setFavorites((prevFavorites) => prevFavorites.filter((recipe) => recipe.id !== recipeId));
	};

	// CHECK IF RECIPE IN FAVORITES FOR UX DISPLAY
	const isFavorite = (recipeId) => {
		return favorites.some((recipe) => recipe.id === recipeId);
	};

	// RETURN RECIPE BY PASSED ID
	// NOTE - ID IS THE SOLE SOURCE OF TRUTH FOR MATCHING RECIPES IN CONTEXT
	const getFavoriteById = (recipeId) => {
		return favorites.find((recipe) => recipe.id === recipeId);
	};

	// RETURN RECIPES BY PASSED IDS ARRAY
	const getFavoritesByIds = (recipeIds) => {
		return favorites.filter((recipe) => recipeIds.includes(recipe.id));
	};

	// GET FAVORITES STATISTICS
	const getFavoritesStats = () => {
		const totalFavorites = favorites.length;
		const cuisineCount = {};
		const dietCount = {};
		let totalCookingTime = 0;
		let recipesWithTime = 0;

		favorites.forEach((recipe) => {
			// Count cuisines
			if (recipe.cuisines) {
				recipe.cuisines.forEach((cuisine) => {
					cuisineCount[cuisine] = (cuisineCount[cuisine] || 0) + 1;
				});
			}

			// Count diets
			if (recipe.diets) {
				recipe.diets.forEach((diet) => {
					dietCount[diet] = (dietCount[diet] || 0) + 1;
				});
			}

			// Calculate average cooking time
			if (recipe.readyInMinutes) {
				totalCookingTime += recipe.readyInMinutes;
				recipesWithTime++;
			}
		});

		const averageCookingTime = recipesWithTime > 0 ? Math.round(totalCookingTime / recipesWithTime) : 0;
		const topCuisine = Object.keys(cuisineCount).reduce((a, b) => (cuisineCount[a] > cuisineCount[b] ? a : b), null);
		const topDiet = Object.keys(dietCount).reduce((a, b) => (dietCount[a] > dietCount[b] ? a : b), null);

		return {
			totalFavorites,
			averageCookingTime,
			topCuisine,
			topDiet,
			cuisineCount,
			dietCount,
		};
	};

	// SEARCH FAVORITES
	const searchFavorites = (searchTerm) => {
		if (!searchTerm.trim()) return favorites;

		const term = searchTerm.toLowerCase();
		return favorites.filter((recipe) => recipe.title.toLowerCase().includes(term) || recipe.summary?.toLowerCase().includes(term) || recipe.cuisines?.some((cuisine) => cuisine.toLowerCase().includes(term)) || recipe.extendedIngredients?.some((ingredient) => ingredient.name.toLowerCase().includes(term)));
	};

	// VALS AVAIL TO PAGES VIA CONTEXT
	const value = {
		favorites,
		isLoading,
		addToFavorites,
		removeFromFavorites,
		isFavorite,
		clearAllFavorites,
		getFavoriteById,
		getFavoritesByIds,
		searchFavorites,
		getFavoritesStats,		
	};

	return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
