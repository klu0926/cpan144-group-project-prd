import "./contexts/FavoritesContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";

// COMPONENTS
import Navbar from "./components/Navbar";

// STYLES
import "./globals.css";

// FONTS
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// APP META DATA
export const metadata = {
	title: "CPAN144 - Spoonacular API",
	description: "A nice little Spoonacular API APP to find new recipes, save them, and view them for cooking!",
};

// ROOT LAYOUT THAT WRAPS THE APP
export default function RootLayout({ children }) {
	return (
		<FavoritesProvider>
			<html lang="en">
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<div className="bg-blue-800 dark:text-black">
						<Navbar />
						{children}
					</div>
				</body>
			</html>
		</FavoritesProvider>
	);
}
