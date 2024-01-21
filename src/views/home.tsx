import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { TrainingContext } from "@/contexts/training"
import { Set } from "@/types"
import { Link } from "@tanstack/react-router"
import { useContext } from "react"

const SETS: Set[] = ["FOUR", "TWO", "ONE", "PIPE", "FIX", "BACK", "C", "SHOOT"]

export function Home() {
	const { sets, upsertSet } = useContext(TrainingContext)
	const disabled = sets.length < 2

	return (
		<div className="m-auto flex flex-col justify-center p-4">
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
							checked={sets.includes(set)}
							className="border border-indigo-100"
							onCheckedChange={() => upsertSet(set)}
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
				disabled={disabled}
				className={`ml-auto w-32 mt-8 px-4 py-2 flex justify-center items-center rounded-md ${
					disabled
						? "bg-indigo-100 text-indigo-950 cursor-not-allowed"
						: "bg-indigo-900 text-indigo-100"
				}`}
			>
				Continue
			</Link>
		</div>
	)
}
