import { buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Link } from "@tanstack/react-router"

const SETS = ["FOUR", "TWO", "ONE", "PIPE", "FIX", "BACK", "C", "SHOOT"]

export function Home() {
	return (
		<div className="m-auto flex flex-col justify-center">
			<p className="font-semibold text-white text-4xl text-indigo-100 mb-4">
				Choose your sets
			</p>
			<div className="flex flex-col md:flex-row md:justify-center md:items-center">
				{SETS.map((set) => (
					<div
						key={set}
						className="flex items-center space-x-2 mr-4 w-24 my-4"
					>
						<Checkbox
							id={set}
							className="border border-indigo-100"
						/>
						<Label
							htmlFor={set}
							className="text-sm text-white font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							{set}
						</Label>
					</div>
				))}
			</div>
			<Link
				to="/training"
				disabled
				className={buttonVariants({
					variant: "default",
					className:
						"ml-auto w-32 mt-8 bg-indigo-100 text-indigo-950",
				})}
			>
				Continue
			</Link>
		</div>
	)
}
