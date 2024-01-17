import { Set } from "@/types"
import { PropsWithChildren, createContext, useState } from "react"

export const TrainingContext = createContext<{
	sets: Set[]
	upsertSet: (set: Set) => void
}>({
	sets: [],
	upsertSet: () => {},
})

export const TrainingProvider = (props: PropsWithChildren) => {
	const [sets, setSets] = useState<Set[]>([])

	const upsertSet = (set: Set) => {
		setSets((prevSets) => {
			if (prevSets.includes(set)) {
				return prevSets.filter((s) => s !== set)
			} else {
				return [...prevSets, set]
			}
		})
	}

	return (
		<TrainingContext.Provider value={{ sets, upsertSet }}>
			{props.children}
		</TrainingContext.Provider>
	)
}
