import * as poseDetection from "@tensorflow-models/pose-detection"
import { PosenetModelConfig } from "@tensorflow-models/pose-detection"
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl" // Import WebGL backend
import { debounce } from "lodash"
import React, { useEffect, useRef } from "react"

function getVoices() {
	let voices = speechSynthesis.getVoices()
	if (!voices.length) {
		const utterance = new SpeechSynthesisUtterance("")
		speechSynthesis.speak(utterance)
		voices = speechSynthesis.getVoices()
	}
	return voices
}

function makeCall() {
	const to = [
		"FOUR",
		"TWO",
		"PIPE",
		"ONE",
		"HEAD",
		"FLOAT",
		"SHOOT",
		"HEADBACK",
	]
	const textToSpeak = to[Math.floor(Math.random() * to.length)]
	document.getElementById("call")!.innerHTML = textToSpeak
	const speakData = new SpeechSynthesisUtterance()
	speakData.volume = 1 // From 0 to 1
	speakData.rate = 1 // From 0.1 to 10
	speakData.pitch = 2 // From 0 to 2
	speakData.text = textToSpeak
	speakData.lang = "en"
	speakData.voice = getVoices()[0]

	speechSynthesis.speak(speakData)
}

const debouncedMakeCall = debounce(makeCall, 500, {
	leading: true,
	trailing: false,
})

const CameraFeed: React.FC = () => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const setting = useRef<boolean>(false)

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
					const leftElbow = normalizedPoses[7]
					const leftShoulder = normalizedPoses[5]

					const isLeftElbowValid =
						leftElbow && leftElbow.score && leftElbow.score > 0.3
					const isNoseValid =
						leftShoulder &&
						leftShoulder.score &&
						leftShoulder.score > 0.75

					if (isLeftElbowValid && isNoseValid) {
						if (setting.current && leftElbow.y > leftShoulder.y) {
							setting.current = false
						}
						if (leftElbow.y < leftShoulder.y && !setting.current) {
							setting.current = true
							debouncedMakeCall()
							requestAnimationFrame(() =>
								detectPose(detector, video)
							)
						} else {
							requestAnimationFrame(() =>
								detectPose(detector, video)
							)
						}
					} else {
						requestAnimationFrame(() => detectPose(detector, video))
					}
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
	}, [])

	return (
		<div style={{ position: "relative" }}>
			<video
				id="video"
				ref={videoRef}
				autoPlay
				playsInline
				height={window.innerHeight}
				width={window.innerWidth}
			></video>
			<div style={{ position: "absolute", top: 0 }}>
				<h1 id="call" style={{ color: "red" }}></h1>
			</div>
		</div>
	)
}

export default CameraFeed
