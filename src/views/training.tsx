import { Link } from "@tanstack/react-router"
import { Detection } from "../features/detection/Detection"

export function Training() {
	return (
		<>
			<Detection />
			<section className="absolute z-10 top-4 left-4 flex">
				<Link
					to="/"
					className={`bg-transparent hover:bg-indigo-950 mr-4 px-4 py-2 flex justify-center items-center rounded-lg`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						className="w-6 h-6 stroke-white	"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
						/>
					</svg>
				</Link>
				<p className="text-3xl font-bold text-white">Training</p>
			</section>
		</>
	)
}
