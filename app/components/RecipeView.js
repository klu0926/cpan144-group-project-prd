import { useState } from "react";
import CookingModal from "./CookingModal";
import { stripHtmlTags } from "../utils/utils";

export default function RecipeView({ recipe, isFavorite, onToggleFavorite, showFavoriteButton = true, showCookingModal = false }) {
	
	const [isModalOpen, setIsModalOpen] = useState(false);

	// FAVORITE TOGGLE LOGIC
	const handleFavoriteClick = (e) => {
		onToggleFavorite(recipe);
	};

	// HANDLE THE MODAL VIEW
	const handleViewRecipe = () => {
		if (showCookingModal) {
			setIsModalOpen(true);
		}
	};

	const formatTime = (minutes) => {
		if (!minutes) return "N/A";
		if (minutes < 60) return `${minutes} min`;
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	};

		const getDietBadges = () => {
		const badges = [];
		if (recipe.vegetarian) badges.push("Vegetarian");
		if (recipe.vegan) badges.push("Vegan");
		if (recipe.glutenFree) badges.push("Gluten-Free");
		if (recipe.dairyFree) badges.push("Dairy-Free");
		if (recipe.ketogenic) badges.push("Keto");
		return badges;
	};

	return (
		<>
			<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
				{/* Recipe Image  */}
				<div className="relative">
					<img
						src={recipe.image || "/api/placeholder/300/200"}
						alt={recipe.title}
						className="w-full h-48 object-cover"
						onError={(e) => {
							e.target.src = "/api/placeholder/300/200";
						}}
					/>

					{/* FAVORITE TOGGLE BUTTON USING STATE*/}
					{showFavoriteButton && (
						<button
							onClick={handleFavoriteClick}
							className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isFavorite ? "bg-red-500 text-white hover:bg-red-600" : "bg-white text-gray-400 hover:text-red-500 hover:bg-gray-50"}`}
							aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
						>
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					)}

					{/* Ready Time Badge */}
					{recipe.readyInMinutes && <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">⏱️ {formatTime(recipe.readyInMinutes)}</div>}

				</div>

				{/* RECIPE CONTENT */}
				<div className="p-4">
					{/* Title */}
					<h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">{recipe.title}</h3>

					{/* Diet Badges */}
					{getDietBadges().length > 0 && (
						<div className="flex flex-wrap gap-1 mb-3">
							{getDietBadges().map((badge, index) => (
								<span
									key={index}
									className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
								>
									{badge}
								</span>
							))}
						</div>
					)}					

					{/* Recipe STATS */}
					<div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
						{recipe.servings && (
							<div className="flex items-center">
								<span className="mr-1">👥</span>
								<span>{recipe.servings} servings</span>
							</div>
						)}
						{recipe.healthScore && (
							<div className="flex items-center">
								<span className="mr-1">💚</span>
								<span>{recipe.healthScore}% healthy</span>
							</div>
						)}
					</div>

					{/* RECIPE SUMMARY */}
					{recipe.summary && <p className="text-gray-600 text-sm line-clamp-3 mb-4">{stripHtmlTags(recipe.summary)}</p>}

					{/* ACTION BUTTONS */}
					<div className="flex gap-2">
						{showCookingModal && (
							<button
								onClick={handleViewRecipe}
								className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
							>
								View Recipe
							</button>
						)}

						{recipe.sourceUrl && (
							<a
								href={recipe.sourceUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium text-center transition-colors"
							>
								Original Recipe
							</a>
						)}
					</div>

					{/* Cuisines */}
					{recipe.cuisines && recipe.cuisines.length > 0 && (
					<div className="mt-3 pt-3 border-t border-gray-100">
						<div className="flex flex-wrap gap-1">
							{recipe.cuisines.slice(0, 3).map((cuisine, index) => (
								<span
									key={index}
									className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
								>
									{cuisine}
								</span>
							))}
							{recipe.cuisines.length > 3 && <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">+{recipe.cuisines.length - 3} more</span>}
						</div>
					</div>
					)}
				</div>
			</div>

			{/* COOKING MODAL COMPONENT */}
			{isModalOpen && (
				<CookingModal
					recipe={recipe}
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</>
	);
}
