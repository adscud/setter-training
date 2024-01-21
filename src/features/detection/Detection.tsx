import { TrainingContext } from "@/contexts/training"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { PosenetModelConfig } from "@tensorflow-models/pose-detection"
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl" // Import WebGL backend
import { motion } from "framer-motion"
import { debounce } from "lodash"
import { useContext, useEffect, useRef } from "react"

function getVoices() {
	let voices = speechSynthesis.getVoices()
	if (!voices.length) {
		const utterance = new SpeechSynthesisUtterance("")
		speechSynthesis.speak(utterance)
		voices = speechSynthesis.getVoices()
	}
	return voices
}

export function Detection() {
	const videoRef = useRef<HTMLVideoElement>(null)
	const setting = useRef<boolean>(false)
	const { sets } = useContext(TrainingContext)

	const makeCall = () => {
		const textToSpeak = sets[Math.floor(Math.random() * sets.length)]
		const speakData = new SpeechSynthesisUtterance()
		const voices = getVoices()

		speakData.volume = 1 // From 0 to 1
		speakData.rate = 1 // From 0.1 to 10
		speakData.pitch = 2 // From 0 to 2
		speakData.text = textToSpeak
		speakData.lang = "en"
		speakData.voice = voices[0]

		speechSynthesis.speak(speakData)

		setTimeout(() => {
			setting.current = false
		}, 2000)
	}

	const debouncedMakeCall = debounce(makeCall, 1000, {
		leading: true,
		trailing: false,
	})

	useEffect(() => {
		const setupCamera = async () => {
			if (navigator.mediaDevices.getUserMedia && videoRef.current) {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				})
				videoRef.current.srcObject = stream
				return new Promise((resolve) => {
					videoRef.current!.onloadedmetadata = () => {
						resolve(videoRef.current)
					}
				})
			}
		}

		const detectPose = async (
			detector: poseDetection.PoseDetector,
			video: HTMLVideoElement
		) => {
			if (videoRef.current) {
				const poses = await detector.estimatePoses(video)

				const normalizedPoses =
					await poseDetection.calculators.keypointsToNormalizedKeypoints(
						poses[0].keypoints,
						video
					)
				if (poses && poses.length > 0) {
					const nose = normalizedPoses[0]
					const leftElbow = normalizedPoses[7]

					if (
						leftElbow.y < nose.y + 0.05 &&
						!setting.current &&
						leftElbow.score &&
						leftElbow.score > 0.7
					) {
						setting.current = true
						debouncedMakeCall()
					}

					requestAnimationFrame(() => {
						detectPose(detector, video)
					})
				}
			}
		}

		const runPosenet = async () => {
			const detectorConfig: PosenetModelConfig = {
				architecture: "MobileNetV1",
				outputStride: 16,
				inputResolution: { width: 640, height: 480 },
				multiplier: 0.75,
			}
			const detector = await poseDetection.createDetector(
				poseDetection.SupportedModels.PoseNet,
				detectorConfig
			)
			await setupCamera()

			const video = document.querySelector("#video") as HTMLVideoElement
			detectPose(detector, video)
		}

		tf.setBackend("webgl")
			.then(() => {
				runPosenet()
			})
			.catch(() => {
				runPosenet()
			})
	}, [debouncedMakeCall])

	return (
		<div className="flex justify-center items-center h-full w-full">
			<video
				id="video"
				ref={videoRef}
				autoPlay
				playsInline
				height={window.innerHeight}
				width={window.innerWidth}
				className="object-cover"
				style={{ display: "none" }}
			></video>
			<div className="m-auto px-4">
				<motion.div
					className="bg-indigo-500 h-20 w-20 mx-auto"
					animate={{
						scale: [1, 2, 2, 1, 1],
						rotate: [0, 0, 180, 180, 0],
						borderRadius: ["0%", "0%", "50%", "50%", "0%"],
					}}
					transition={{
						duration: 2,
						ease: "easeInOut",
						times: [0, 0.2, 0.5, 0.8, 1],
						repeat: Infinity,
						repeatDelay: 1,
					}}
				/>
				<p className="mt-20 text-white text-center">
					Start setting, work your neutral position!
				</p>
				<p className="text-center text-indigo-500 text-xs mt-2">
					(i) We need your permission for the camera and the
					microphone
				</p>
			</div>
		</div>
	)
}
