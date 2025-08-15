"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, isActive, children }) {
	return (
		<Link
			className={`cursor-pointer py-0.5 px-3 rounded-t -mb-3 ${isActive ? "bg-slate-100 text-black" : "bg-gray-300 text-gray-800"}`}
			href={href}
		>
			{children}
		</Link>
	);
}

export default function Navbar() {
	const pathname = usePathname();
	return (
		<div className="container mx-auto">
			<div className="flex gap-3 py-3 px-10">
				<NavLink
					href={"/"}
					isActive={pathname == "/"}
				>
					Home
				</NavLink>
				<NavLink
					href={"/favorites"}
					isActive={pathname === "/favorites"}
				>
					Favorites
				</NavLink>
				<NavLink
					href={"/about"}
					isActive={pathname === "/about"}
				>
					About Us
				</NavLink>
			</div>
		</div>
	);
}
