import { useState } from "react";

export default function FormFavorites({ onFilter, totalRecipes, filteredCount }) {
	// STORE THE FORM VALS ON STATE
	const [formData, setFormData] = useState({
		cuisine: "all",
		maxReadyTime: "",
		includeIngredients: "",
		sortBy: "",
	});

	//state for diet checkboxes
	const [dietFilters, setDietFilters] = useState({
		vegetarian: false,
		vegan: false,
		glutenFree: false,
		dairyFree: false,
		ketogenic: false,
	});

	//dropdown options
	const cuisineOptions = [
		"African",
		"American",
		"British",
		"Cajun",
		"Caribbean",
		"Chinese",
		"Eastern European",
		"European",
		"French",
		"German",
		"Greek",
		"Indian",
		"Irish",
		"Italian",
		"Japanese",
		"Jewish",
		"Korean",
		"Latin American",
		"Mediterranean",
		"Mexican",
		"Middle Eastern",
		"Nordic",
		"Southern",
		"Spanish",
		"Thai",
		"Vietnamese",
	];

	// Sort Options
	const sortOptions = [
		{ value: "", label: "Default Order" },
		{ value: "title", label: "Recipe Name (A-Z)" },
		{ value: "readyTime", label: "Cooking Time (Shortest First)" },
		{ value: "healthScore", label: "Health Score (Highest First)" },
	];

	// time options
	const timeOptions = [
		{ value: "", label: "Any Time" },
		{ value: "15", label: "Under 15 minutes" },
		{ value: "30", label: "Under 30 minutes" },
		{ value: "45", label: "Under 45 minutes" },
		{ value: "60", label: "Under 1 hour" },
		{ value: "120", label: "Under 2 hours" },
	];

	// HANDLE CHANGES TO THE FORM VALUES
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		const newFormData = {
			...formData,
			[name]: value,
		};
		setFormData(newFormData);
		applyFilters(newFormData, dietFilters);
	};

	// handle changes in diet
	const handleDietChange = (e) => {
		const { name, checked } = e.target;
		const newDietFilters = {
			...dietFilters,
			[name]: checked,
		};
		setDietFilters(newDietFilters);
		applyFilters(formData, newDietFilters);
	};

	// Combine and send all filters back to parent from onFilter
	const applyFilters = (formFilters, dietaryFilters) => {
		const filters = {
			...formFilters,
			diets: Object.entries(dietaryFilters)
				.filter(([_, checked]) => checked)
				.map(([diet, _]) => diet),
		};

		onFilter(filters);
	};

	// Reset all filter states
	const handleReset = () => {
		const resetFormData = {
			cuisine: "all",
			maxReadyTime: "",
			includeIngredients: "",
			sortBy: "",
		};

		const resetDietFilters = {
			vegetarian: false,
			vegan: false,
			glutenFree: false,
			dairyFree: false,
			ketogenic: false,
		};

		setFormData(resetFormData);
		setDietFilters(resetDietFilters);
		applyFilters(resetFormData, resetDietFilters);
	};

	//check to see if filters are active
	const hasActiveFilters = () => {
		return formData.cuisine !== "all" || formData.maxReadyTime !== "" || formData.includeIngredients !== "" || formData.sortBy !== "" || Object.values(dietFilters).some((checked) => checked);
	};

	// FINALLY, RETURN THE FORM VIEW
	return (
		<div className="form-style">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h2 className="text-lg font-semibold text-gray-800">Filter Your Favorites</h2>
					<p className="text-sm text-gray-600">
						{filteredCount} of {totalRecipes} recipes shown
					</p>
				</div>

				<div className="flex items-center gap-3">
					{hasActiveFilters() && (
						<button
							onClick={handleReset}
							className="text-sm text-blue-600 hover:text-blue-800 underline"
						>
							Clear All Filters
						</button>
					)}
				</div>
			</div>

			{/* Quick Filters (Always Visible) */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<div>
					<label
						htmlFor="sortBy"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Sort By
					</label>
					<select
						id="sortBy"
						name="sortBy"
						value={formData.sortBy}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
					>
						{sortOptions.map((option) => (
							<option
								key={option.value}
								value={option.value}
							>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor="maxReadyTime"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Cooking Time
					</label>
					<select
						id="maxReadyTime"
						name="maxReadyTime"
						value={formData.maxReadyTime}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
					>
						{timeOptions.map((option) => (
							<option
								key={option.value}
								value={option.value}
							>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor="cuisine"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Cuisine
					</label>
					<select
						id="cuisine"
						name="cuisine"
						value={formData.cuisine}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
					>
						<option value="all">All Cuisines</option>
						{cuisineOptions.map((cuisine) => (
							<option
								key={cuisine}
								value={cuisine}
							>
								{cuisine}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Checkbox Filters */}

			<div className="border-t border-gray-200 pt-4 space-y-4">
				{/* Ingredient Search */}
				<div>
					<label
						htmlFor="includeIngredients"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Search by Ingredients
					</label>
					<input
						type="text"
						id="includeIngredients"
						name="includeIngredients"
						value={formData.includeIngredients}
						onChange={handleInputChange}
						placeholder="e.g., chicken, tomatoes, cheese"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
					/>
					<p className="text-xs text-gray-500 mt-1">Find recipes containing specific ingredients</p>
				</div>

				{/* Dietary Filters */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-3">Dietary Preferences</label>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
						{Object.entries(dietFilters).map(([diet, checked]) => (
							<label
								key={diet}
								className="flex items-center"
							>
								<input
									type="checkbox"
									name={diet}
									checked={checked}
									onChange={handleDietChange}
									className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span className="ml-2 text-sm text-gray-700">{diet === "glutenFree" ? "Gluten-Free" : diet === "dairyFree" ? "Dairy-Free" : diet.charAt(0).toUpperCase() + diet.slice(1)}</span>
							</label>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
