import {
	Outlet,
	RootRoute,
	Route,
	Router,
	RouterProvider,
} from "@tanstack/react-router"
import { Home } from "./views/home"
import { Training } from "./views/training"

const rootRoute = new RootRoute({
	component: () => {
		return <Outlet />
	},
})

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

const routeTree = rootRoute.addChildren([homeRoute, trainingRoute])

const router = new Router({ routeTree })

export default function App() {
	return <RouterProvider router={router} />
}
