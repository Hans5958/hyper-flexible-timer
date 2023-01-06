<template>
	<div class='timer p-4 rounded shadow-lg hover:shadow-2xl transition ease-in-out text-center flex flex-col justify-center bg-white relative overflow-hidden' @click='globalClick'>
		<div class='w-full rounded-t absolute top-0 left-0'>
			<div class='h-2 bg-black opacity-25' :style="{ width: percentage * 100 + '%' }" v-if='!countingUp'>
			</div>
		</div>
		<div class="mb-2" v-if='displayTitle'>
			<p class='text-2xl cursor-pointer group' @click='rename'>
				{{ displayTitle }}
				<span class='text-base hidden group-hover:inline'><Icon icon="clarity:pencil-solid" :inline="true" /></span>
			</p>
		</div>
		<div class="display mb-4">
			<p class='text-xl cursor-pointer group' :class="{ 'timer-blinking': isBlinking }" @click='retime'>
				<span class='text-6xl'>{{ display }}</span><span class='text-xl text-gray-500'>.{{ displayMs }}</span>
				<span class='text-xl hidden group-hover:inline ml-1'><Icon icon="clarity:pencil-solid" :inline="true" /></span>
			</p>
		</div>
		<div class="controls">
			<button class='bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-200 transition ease-in-out rounded p-2 text-sm font-semibold mr-1' type='button' @click='start' v-if='!isStarted'>
				<Icon icon="clarity:play-solid" :inline="true" />
				Start
			</button>
			<button class='bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-2 focus:ring-yellow-200 transition ease-in-out rounded p-2 text-sm font-semibold mr-1' type='button' @click='pause' v-else>
				<Icon icon="clarity:pause-solid" :inline="true" />
				Pause
			</button>
			<button class='bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-200 transition ease-in-out rounded p-2 text-sm font-semibold mr-1' type='button' @click='stop' v-if='!isStopped'>
				<Icon icon="clarity:stop-solid" :inline="true" />
				Stop
			</button>
			<button class='bg-blue-700 hover:bg-blue-800 text-white focus:ring-2 focus:ring-blue-200 transition ease-in-out rounded p-2 text-sm font-semibold mr-1' type='button' @click='countup' v-if='!countingUp'>
				<Icon icon="clarity:plus-circle-solid" :inline="true" />
				Count Up
			</button>
			<button class='bg-blue-700 hover:bg-blue-800 text-white focus:ring-2 focus:ring-blue-200 transition ease-in-out rounded p-2 text-sm font-semibold mr-1 disabled:bg-blue-700 disabled:opacity-50' type='button' @click='countdown' v-else :disabled="isStopped && defaultSeconds === 0">
				<Icon icon="clarity:minus-circle-solid" :inline="true" />
				Count Down
			</button>
			<button class='bg-red-700 hover:bg-red-800 text-white focus:ring-2 focus:ring-red-200 transition ease-in-out rounded p-2 text-sm font-semibold' type='button' @click='remove'>
				<Icon icon="clarity:trash-solid" :inline="true" />
				Remove
			</button>	
		</div>
	</div>
</template>

<style>
svg[style*="vertical-align"] {
	display: inline;
}
</style>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import Swal from 'sweetalert2'

const emit = defineEmits(['remove'])

const timeUnitSeconds = [
	1,
	60,
	60 * 60,
	24 * 60 * 60,
]

const convertTimeFromString = (string = '') => {
	const timeUnits = string.split(':').reverse()
	let seconds = 0
	let isNotNaN = false
	timeUnits.forEach((unit, index) => {
		if (timeUnitSeconds[index] && !isNaN(unit)) {
			seconds += unit * timeUnitSeconds[index]
			isNotNaN = true
		}
	})
	if (isNotNaN) return seconds
	else return NaN
}

const props = defineProps(['id'])

let displayTitle = ref('Timer'),
	display = ref('00:00:00'),
	displayMs = ref('000'),
	percentage = ref(0),
	defaultSeconds = 0,
	isStarted = false,
	isStopped = true,
	countingUp = ref(true),
	targetTimestamp = 0,
	pausedDifference = 0,
	isBlinking = false,
	interval = () => {}

function start() {
	let nowTimestamp = Date.now()
	let targetTime = defaultSeconds
	if (pausedDifference) {
		targetTime = pausedDifference
		pausedDifference = 0
	}
	if (countingUp.value) targetTimestamp = nowTimestamp - targetTime
	else targetTimestamp = nowTimestamp + targetTime
	interval = setInterval(() => {
		if (!countingUp.value && targetTimestamp - Date.now() < 1) {
			stop()
			updateDisplay(0)
			isBlinking = true
			if (defaultSeconds === 0) countingUp.value = true
		} else updateDisplay()
	}, 10)
	isStarted = true
	isStopped = false
	isBlinking = false
}

function pause() {
	let nowTimestamp = Date.now()
	pausedDifference = Math.abs(targetTimestamp - nowTimestamp)
	clearInterval(interval)
	updateDisplay()
	isStarted = false
}

function stop() {
	if (isStarted) pause()
	reset()
	updateDisplay()
	isStopped = true
}

function reset() {
	let nowTimestamp = Date.now()
	if (countingUp.value) targetTimestamp = nowTimestamp - defaultSeconds
	else targetTimestamp = nowTimestamp + defaultSeconds
	pausedDifference = 0
}

/**
 * Remove the timer from parent component
 */
function remove() {
	emit('remove', props.id)
}

/**
 * Update both display (hh:mm:ss and miliseconds)
 * @param {number} targetTime 
 */
function updateDisplay(targetTime) {
	let nowTimestamp = Date.now()
	if (targetTime !== undefined) {
		if (countingUp.value) targetTimestamp = nowTimestamp - targetTime
		else targetTimestamp = nowTimestamp + targetTime
	}
	const time = Math.abs(Date.now() - targetTimestamp) / 1000
	const numMs = Math.floor((time % 1) * 1000)
	const numS = Math.floor(time % 60)
	const numM = Math.floor(time/60) % 60
	const numH = Math.floor(time/3600) % 24
	const numD = Math.floor(time/86400)
	let displayTemp = numS.toString().padStart(2, '0')
	displayTemp = numM.toString().padStart(2, '0') + ':' + displayTemp
	displayTemp = numH.toString().padStart(2, '0') + ':' + displayTemp
	if (numD) displayTemp = numD.toString().padStart(2, '0') + ':' + displayTemp
	display.value = displayTemp
	displayMs.value = ("000" + numMs).slice(-3)
	if (!countingUp.value && defaultSeconds) {
		percentage.value = time * 1000 / defaultSeconds
	}
	// console.log(display)
}

/**
 * Change the title
 */
async function rename() {
	// To change the title
	let { value: title } = await Swal.fire({
		title: 'Enter the new title',
		input: 'text',
		inputValue: displayTitle.value,
		showCancelButton: true
	})
	if (title !== undefined) displayTitle.value = title
}

function countup() {
	// Switch to counting up
	countingUp.value = true
	let nowTimestamp = Date.now()
	let difference = Math.abs(targetTimestamp - nowTimestamp)
	targetTimestamp = nowTimestamp - difference
	// updateDisplay()
}

/**
 * Switch timer to counting down
 */
function countdown() {
	if (!countingUp.value && defaultSeconds) {
		percentage.value = time * 1000 / defaultSeconds
	}
	countingUp.value = false
	let nowTimestamp = Date.now()
	let difference = Math.abs(targetTimestamp - nowTimestamp)
	targetTimestamp = nowTimestamp + difference
	// updateDisplay()
}

/**
 * Change the timer's time
 */
async function retime() {
	let { value: input } = await Swal.fire({
		title: 'Enter the new time',
		input: 'text',
		inputValue: defaultSeconds / 1000,
		showCancelButton: true,
		inputValidator: (input) => {
			let inputSecs = convertTimeFromString(input)
			console.log(inputSecs)
			if (Number.isNaN(Number(inputSecs))) {
				return 'Enter a valid value!'
			} else if (inputSecs < 0) {
				return 'Enter a positive number!'
			}
		}
	})

	if (!input) return

	defaultSeconds = convertTimeFromString(input) * 1000
	updateDisplay(defaultSeconds)
	if (pausedDifference) pausedDifference += defaultSeconds
}

function globalClick() {
	isBlinking = false
}
</script>

<style>

.timer-blinking {
	animation-duration: 1000ms;
	animation-name: blink;
	animation-iteration-count: infinite;
	animation-direction: normal;
}

@keyframes blink {
	from {
		opacity: 1;
	}
	49% {
		opacity: 1;
	}
	51% {
		opacity: 0.25
	}
	to {
		opacity: 0.25;
	}
}

</style>