<template>
	<div class='timer p-4 rounded border-2 border-gray-400 border-solid text-center flex flex-col justify-center'>
		<div class="mb-2" v-if='title'>
			<p class='text-2xl cursor-pointer' @click='rename'>{{ title }}</p>
		</div>
		<div class="display mb-4">
			<p class='text-6xl cursor-pointer' @click='retime'>{{ display }}<span class='text-xl text-gray-500'>.{{ displayms }}</span></p>
		</div>
		<div class="controls">
			<button class='bg-green-600 hover:bg-green-700 text-white rounded p-2' type='button' @click='start' v-if='!isStarted'>
				<client-only><Icon icon="clarity:play-solid" :inline="true" /></client-only>
				Start
			</button>
			<button class='bg-yellow-600 hover:bg-yellow-700 text-white rounded p-2' type='button' @click='pause' v-if='isStarted'>
				<client-only><Icon icon="clarity:pause-solid" :inline="true" /></client-only>
				Pause
			</button>
			<button class='bg-red-600 hover:bg-red-700 text-white rounded p-2' type='button' @click='stop'>
				<client-only><Icon icon="clarity:stop-solid" :inline="true" /></client-only>
				Stop
			</button>
			<button class='bg-blue-700 hover:bg-blue-800 text-white rounded p-2' type='button' @click='countup' v-if='!countingUp'>
				<client-only><Icon icon="clarity:plus-circle-solid" :inline="true" /></client-only>
				Count Up
			</button>
			<button class='bg-blue-700 hover:bg-blue-800 text-white rounded p-2' type='button' @click='countdown' v-if='countingUp'>
				<client-only><Icon icon="clarity:minus-circle-solid" :inline="true" /></client-only>
				Count Down
			</button>
			<button class='bg-red-700 hover:bg-red-800 text-white rounded p-2' type='button' @click='remove'>
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
import { Icon } from '@iconify/vue2';

export default {
	props: [
		'id'
	],
	data() {
		return {
			display: '00:00:00',
			d: 0,
			h: 0,
			m: 0,
			s: 0,
			isStarted: false,
			interval: () => {},
			title: 'Timer',
			countingUp: true,
			default: 0,
			targetTimestamp: 0,
			pausedDifference: 0,
			displayms: '000'
		}
	},
	methods: {
		start() {
			let nowTimestamp = Date.now()
			let targetTime = this.default
			if (this.pausedDifference) {
				targetTime = this.pausedDifference
				this.pausedDifference = 0
			}
			if (this.countingUp) this.targetTimestamp = nowTimestamp - targetTime
			else this.targetTimestamp = nowTimestamp + targetTime
			this.interval = setInterval(() => {
				if (!this.countingUp && this.targetTimestamp - Date.now() < 1) {
					this.pause()
					this.updateDisplay(0)
				} else this.updateDisplay()
			}, 10)
			this.isStarted = true
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
		},
		reset() {
			let nowTimestamp = Date.now()
			if (this.countingUp) this.targetTimestamp = nowTimestamp - this.default
			else this.targetTimestamp = nowTimestamp + this.default
			this.pausedDifference = 0
		},
		remove() {
			this.$emit('remove', this.id)
		},
		updateDisplay(targetTime) {
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
			let display = `${(this.s+'').length === 1 ? 0 : ''}${this.s}`
			display = `${(this.m+'').length === 1 ? 0 : ''}${this.m}:` + display
			display = `${(this.h+'').length === 1 ? 0 : ''}${this.h}:` + display
			if (this.d) display = `${(this.d+'').length === 1 ? 0 : ''}${this.d}:` + display
			this.display = display
			this.displayms = ("000" + this.ms).slice(-3)
			// console.log(display)
		},
		rename() {
			this.title = prompt('Enter a new title for this timer.')
		},
		countup() {
			this.countingUp = true
			let nowTimestamp = Date.now()
			let difference = Math.abs(this.targetTimestamp - nowTimestamp)
			this.targetTimestamp = nowTimestamp - difference
		},
		countdown() {
			this.countingUp = false
			let nowTimestamp = Date.now()
			let difference = Math.abs(this.targetTimestamp - nowTimestamp)
			this.targetTimestamp = nowTimestamp + difference
		},
		retime() {
			let input = prompt('Enter the new time in seconds.')
			if (!Number.isNaN(Number(input)) && input > -1 ) {
				this.default = Number(input) * 1000
				this.updateDisplay(this.default)
				if (this.pausedDifference) this.pausedDifference += this.default
			}
		},
	},
	components: {
		Icon,
	},
}
</script>
