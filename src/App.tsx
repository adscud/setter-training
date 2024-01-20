import {
	RootRoute,
	Route,
	Router,
	RouterProvider,
	createMemoryHistory,
} from "@tanstack/react-router"
import { TrainingProvider } from "./contexts/training"
import { Home } from "./views/home"
import { Training } from "./views/training"

const rootRoute = new RootRoute()

const homeRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Home,
})

const trainingRoute = new Route({
	getParentRoute: () => rootRoute,
	path: "/training",
	component: Training,
})

const memoryHistory = createMemoryHistory({
	initialEntries: ["/"], // Pass your initial url
})

const routeTree = rootRoute.addChildren([homeRoute, trainingRoute])

const router = new Router({ routeTree, history: memoryHistory })

export default function App() {
	return (
		<TrainingProvider>
			<div className="h-screen w-screen bg-indigo-950 flex flex-col">
				<RouterProvider router={router} />
			</div>
		</TrainingProvider>
	)
}
