"use client";

import { useState } from "react";
// FAVORITES CONTEXT
import { useFavorites } from "./contexts/FavoritesContext";

// IMP THE FORM QUERY COMPONENT
import FormQuery from "./components/FormQuery";
import RecipeList from "./components/RecipeList";

export default function QueryPage() {
	// THE RECIPES, LOADING & ERROR STATE VARS
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// RESULTS
	const [totalResults, setTotalResults] = useState(0);

	// OFFSET WILL BE FOR LOADMORE LOGIC
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(false);

	// FOR THE USER INPUT FORM
	const [currentQuery, setCurrentQuery] = useState(null);

	// THE FAVORITES CONTEXT VALS & LOGIC
	const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

	// HANDLE RECIPES SEARCH FROM FORM QUERY AND IF LOAD MORE BUTTON PRESSED
	const searchRecipes = async (queryParams, isLoadMore = false) => {
		// MAKE API QUERY AND FILLING PAGE STATE VARS
		console.log("RUNNING SEARCH RECIPES");

		// SET LOADING AND RESET ERROR
		setLoading(true);
		setError(null);

		// BEGIN ATTEMPT AT API QUERY
		try {
			// GET THE KEY FROM THE ENV FILE
			// NOTE - LOCAL DEV HAS THEIR OWN FILE
			// NOTE - ONLY KEYS PREFIXED WITH NEXT_PUBLIC ARE AVAIL TO THE WEB/CLIENT SIDE
			const apiKey = process.env.NEXT_PUBLIC_API_KEY;
			console.log("ENV API_KEY[" + process.env.NEXT_PUBLIC_API_KEY + "]");
			console.log("USING APIKEY[" + apiKey + "]");

			// UPDATE THE SEARCHOFFSET FOR LOADMORE BUTTON
			const searchOffset = isLoadMore ? offset : 0;

			// MAKE THE URL BASE
			var url = "https://api.apilayer.com/spoonacular";

			// ADD THE ENDPOINT
			url += "/recipes/complexSearch?";

			// MAKE THE QUERY STRING
			var query_str = "";

			// ENFORCE MAX RETURN AND CURRENT OFFSET
			// NOTE - API DEFAULT IS SUPPOSED TO BE 10
			const MAX_QUERY_NUMBER = 8;
			queryParams.number = MAX_QUERY_NUMBER;
			queryParams.offset = searchOffset;
			queryParams.addRecipeInformation = true;
			queryParams.instructionsRequired = true;
			queryParams.addRecipeNutrition = true;
			queryParams.fillIngredients = true;

			// ADD THE QUERY VALS TO THE URL
			console.log("QUERY PARAMS OBJ FROM THE FORM");
			console.log(queryParams);

			// MAKE SEARCH PARAMS OBJ
			const searchParams = new URLSearchParams({
				...queryParams,
			});

			// MAKE QUERY STRING
			var query_str = searchParams.toString();
			console.log("USING QUERY STRING[" + query_str + "]");

			// ADD QUERY TO URL
			url += query_str;
			console.log("USING URL[" + url + "]");

			// GET TIME BEFORE THE FETCH AWAIT
			var startTime = Date.now();
			console.log("[" + Date.now().toString() + "] FETCH STARTED");

			// AWAIT THE RESPONSE DIRECT, FRONTEND
			const response = await fetch(url, {
				headers: {
					apikey: apiKey,
				},
			});

			// DEBUG - LOG THE HEADERS
			console.log(response.headers);

			// DEBUG - CALC & LOG THE TIME
			var endTime = Date.now();
			var duration = endTime - startTime;
			console.log("[" + Date.now().toString() + "] FETCH FINISHED IN (" + duration + "ms)");

			// EVAL THE RESPONSE
			if (!response.ok) {
				console.log("REPONSE NOT OK!![" + response.status + "]");
				throw new Error("Failed to fetch recipes " + response.statusText);
			}

			// DESERIALIZE THE QUERY DATA AS AN ARRAY OF RECIPE OBJECTS
			const query_returned_recipe_obj_arr = await response.json();

			// HANDLE IF QUERY WAS FROM LOADMORE
			// NOTE - FORM SUBMISSION SETS isLoadMore TO FALSE TO START NEW
			if (isLoadMore) {
				setRecipes((prev) => [...prev, ...query_returned_recipe_obj_arr.results]);
			} else {
				setRecipes(query_returned_recipe_obj_arr.results);
				setOffset(0);
			}

			// UPDATE VALS
			setTotalResults(query_returned_recipe_obj_arr.totalResults);

			// DEBUG - LOG TOTAL TO CONSOLE
			console.log("TOTAL RESULTS[" + query_returned_recipe_obj_arr.totalResults + "]");

			// UPDATE VIZ OF HAS MORE BUTTON
			setHasMore(query_returned_recipe_obj_arr.results.length === MAX_QUERY_NUMBER && searchOffset + MAX_QUERY_NUMBER < query_returned_recipe_obj_arr.totalResults);

			// UPDATE THE OFFSET STATE VAR VALUE
			setOffset(searchOffset + query_returned_recipe_obj_arr.results.length);

			// UPDAT THE FORM QUERY PARAMS
			setCurrentQuery(queryParams);
		} catch (err) {
			setError(err.message);
			console.error("Error fetching recipes:", err);
		} finally {
			setLoading(false);
		}
	};

	// LOAD MORE BUTTON HANDLING
	const loadMoreRecipes = () => {
		if (currentQuery && hasMore && !loading) {
			searchRecipes(currentQuery, true);
		}
	};

	// TOGGLE FAVORITES ON QUERY RESULT
	const handleToggleFavorite = (recipe) => {
		// DETERMIME IF RECIPE IS FAVORITE IF favorites context HAS ANY MATCHING ID
		const isFavorite = favorites.some((fav) => fav.id === recipe.id);

		// UPDATE RECIPE FAVORITE STATE & BUTTON VIZ
		if (isFavorite) {
			removeFromFavorites(recipe.id);
		} else {
			addToFavorites(recipe);
		}
	};

	// FINALLY, RETURN THE PAGE w/SAME STYLE
	return (
		<div className="page-wrapper">
			<header className="text-center mb-8">
				<h1 className="text-4xl font-bold text-gray-800 mb-2">Query for Recipes</h1>
			</header>

			{/* SEARCH FORM COMPONENT */}
			<FormQuery
				onSearch={searchRecipes}
				loading={loading}
			/>

			{/* ERROR DISPLAY MESG */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
					<strong>Error:</strong> {error}
				</div>
			)}

			{/* RESULTS FROM API WHICH INCLUDES TOTAL ON EVERY RETURN*/}
			{totalResults > 0 && (
				<div className="mb-6">
					<p className="text-gray-600">
						Found {totalResults} recipes. Showing {recipes.length} results.
					</p>
				</div>
			)}

			{/* RECIPE LIST COMPONENT */}
			<RecipeList
				recipes={recipes}
				favorites={favorites}
				onToggleFavorite={handleToggleFavorite}
				showFavoriteButton={true}
			/>

			{/* LOAD MORE BUTTON */}
			{hasMore && (
				<div className="text-center mt-8">
					<button
						onClick={loadMoreRecipes}
						disabled={loading}
						className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
					>
						{loading ? "Loading..." : "Load More Recipes"}
					</button>
				</div>
			)}

			{/* NO RESULTS */}
			{!loading && recipes.length === 0 && currentQuery && (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No recipes found. Try adjusting your search criteria.</p>
				</div>
			)}
		</div>
	);
}
