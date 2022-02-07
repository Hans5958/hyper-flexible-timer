<template>
	<div class='timer p-4 rounded shadow-lg hover:shadow-2xl transition ease-in-out text-center flex flex-col justify-center bg-white relative overflow-hidden' @click='globalClick'>
		<div class='w-full rounded-t absolute top-0 left-0'>
			<div class='h-2 bg-black opacity-25' :style="{ width: percentage * 100 + '%' }" v-if='!countingUp'>
			</div>
		</div>
		<div class="mb-2" v-if='title'>
			<p class='text-2xl cursor-pointer group' @click='rename'>
				{{ title }}
				<span class='text-base hidden group-hover:inline'><client-only><Icon icon="clarity:pencil-solid" :inline="true" /></client-only></span>
			</p>
		</div>
		<div class="display mb-4">
			<p class='text-xl cursor-pointer group' :class="{ 'timer-blinking': isBlinking }" @click='retime'>
				<span class='text-6xl'>{{ display }}</span><span class='text-xl text-gray-500'>.{{ displayms }}</span>
				<span class='text-xl hidden group-hover:inline'><client-only><Icon icon="clarity:pencil-solid" :inline="true" /></client-only></span>
			</p>
		</div>
		<div class="controls">
			<button class='bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-green-200 transition ease-in-out rounded p-2 text-sm font-semibold' type='button' @click='start' v-if='!isStarted'>
				<client-only><Icon icon="clarity:play-solid" :inline="true" /></client-only>
				Start
			</button>
			<button class='bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-2 focus:ring-yellow-200 transition ease-in-out rounded p-2 text-sm font-semibold' type='button' @click='pause' v-else>
				<client-only><Icon icon="clarity:pause-solid" :inline="true" /></client-only>
				Pause
			</button>
			<button class='bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-200 transition ease-in-out rounded p-2 text-sm font-semibold' type='button' @click='stop' v-if='!isStopped'>
				<client-only><Icon icon="clarity:stop-solid" :inline="true" /></client-only>
				Stop
			</button>
			<button class='bg-blue-700 hover:bg-blue-800 text-white focus:ring-2 focus:ring-blue-200 transition ease-in-out rounded p-2 text-sm font-semibold' type='button' @click='countup' v-if='!countingUp'>
				<client-only><Icon icon="clarity:plus-circle-solid" :inline="true" /></client-only>
				Count Up
			</button>
			<button class='bg-blue-700 hover:bg-blue-800 text-white focus:ring-2 focus:ring-blue-200 transition ease-in-out rounded p-2 text-sm font-semibold' type='button' @click='countdown' v-else>
				<client-only><Icon icon="clarity:minus-circle-solid" :inline="true" /></client-only>
				Count Down
			</button>
			<button class='bg-red-700 hover:bg-red-800 text-white focus:ring-2 focus:ring-red-200 transition ease-in-out rounded p-2 text-sm font-semibold' type='button' @click='remove'>
				<client-only><Icon icon="clarity:trash-solid" :inline="true" /></client-only>
				Remove
			</button>	
		</div>
	</div>
</template>

<style>
	svg {
		display: inline
	}
</style>

<script>
import { Icon } from '@iconify/vue2'

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

export default {
	props: [
		'id'
	],
	data() {
		return {
			title: 'Timer',
			display: '00:00:00',
			displayms: '000',
			d: 0,
			h: 0,
			m: 0,
			s: 0,
			percentage: 0,
			defaultSeconds: 0,
			isStarted: false,
			isStopped: true,
			countingUp: true,
			targetTimestamp: 0,
			pausedDifference: 0,
			isBlinking: false,
			interval: () => {},
		}
	},
	methods: {
		start() {
			let nowTimestamp = Date.now()
			let targetTime = this.defaultSeconds
			if (this.pausedDifference) {
				targetTime = this.pausedDifference
				this.pausedDifference = 0
			}
			if (this.countingUp) this.targetTimestamp = nowTimestamp - targetTime
			else this.targetTimestamp = nowTimestamp + targetTime
			this.interval = setInterval(() => {
				if (!this.countingUp && this.targetTimestamp - Date.now() < 1) {
					this.stop()
					this.updateDisplay(0)
					this.isBlinking = true
					console.log(this.isBlinking)
				} else this.updateDisplay()
			}, 10)
			this.isStarted = true
			this.isStopped = false
			this.isBlinking = false
			console.log(this.isBlinking)
		},
		pause() {
			let nowTimestamp = Date.now()
			this.pausedDifference = Math.abs(this.targetTimestamp - nowTimestamp)
			clearInterval(this.interval)
			this.updateDisplay()
			this.isStarted = false
		},
		stop() {
			if (this.isStarted) this.pause()
			this.reset()
			this.updateDisplay()
			this.isStopped = true
		},
		reset() {
			let nowTimestamp = Date.now()
			if (this.countingUp) this.targetTimestamp = nowTimestamp - this.defaultSeconds
			else this.targetTimestamp = nowTimestamp + this.defaultSeconds
			this.pausedDifference = 0
		},
		remove() {
			// Remove the timer from existence
			this.$emit('remove', this.id)
		},
		updateDisplay(targetTime) {
			// Update both display (hh:mm:ss and miliseconds)
			let nowTimestamp = Date.now()
			if (targetTime !== undefined) {
				if (this.countingUp) this.targetTimestamp = nowTimestamp - targetTime
				else this.targetTimestamp = nowTimestamp + targetTime
			}
			const s = Math.abs(Date.now() - this.targetTimestamp) / 1000
			this.ms = Math.floor((s % 1) * 1000)
			this.s = Math.floor(s % 60)
			this.m = Math.floor(s/60) % 60
			this.h = Math.floor(s/3600) % 24
			this.d = Math.floor(s/86400)
			let display = this.s.toString().padStart(2, '0')
			display = this.m.toString().padStart(2, '0') + ':' + display
			display = this.h.toString().padStart(2, '0') + ':' + display
			if (this.d) display = this.d.toString().padStart(2, '0') + ':' + display
			this.display = display
			this.displayms = ("000" + this.ms).slice(-3)
			if (!this.countingUp && this.defaultSeconds) {
				this.percentage = s * 1000 / this.defaultSeconds
			}
			// console.log(display)
		},
		async rename() {
			// To change the title
			let { value: title } = await this.$swal.fire({
				title: 'Enter the new title',
				input: 'text',
				inputValue: this.title,
				showCancelButton: true
			})
			if (title !== undefined) this.title = title
		},
		countup() {
			// Switch to counting up
			this.countingUp = true
			let nowTimestamp = Date.now()
			let difference = Math.abs(this.targetTimestamp - nowTimestamp)
			this.targetTimestamp = nowTimestamp - difference
			// this.updateDisplay()
		},
		countdown() {
			// Switch to counting down
			this.percentage = 0
			this.countingUp = false
			let nowTimestamp = Date.now()
			let difference = Math.abs(this.targetTimestamp - nowTimestamp)
			this.targetTimestamp = nowTimestamp + difference
			// this.updateDisplay()
		},
		async retime() {
			// To change the time
			let { value: input } = await this.$swal.fire({
				title: 'Enter the new time',
				input: 'text',
				inputValue: this.defaultSeconds / 1000,
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

			this.defaultSeconds = convertTimeFromString(input) * 1000
			this.updateDisplay(this.defaultSeconds)
			if (this.pausedDifference) this.pausedDifference += this.defaultSeconds
		},
		globalClick() {
			this.isBlinking = false
		}
	},
	components: {
		Icon,
	},
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