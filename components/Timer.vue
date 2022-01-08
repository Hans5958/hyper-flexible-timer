<template>
	<div class='timer p-4 rounded border-2 border-gray-400 border-solid text-center flex flex-col justify-center'>
		<div class="mb-2" v-if='title'>
			<p class='text-2xl cursor-pointer' @click='rename'>{{ title }}</p>
		</div>
		<div class="display mb-4">
			<p class='text-6xl cursor-pointer' @click='retime'>{{ display }}</p>
		</div>
		<div class="controls">
			<button class='bg-green-600 hover:bg-green-700 text-white rounded p-2' type='button' @click='start' v-if='!isStarted'>Start</button>
			<button class='bg-yellow-600 hover:bg-yellow-700 text-white rounded p-2' type='button' @click='pause' v-if='isStarted'>Pause</button>
			<button class='bg-red-600 hover:bg-red-700 text-white rounded p-2' type='button' @click='stop'>Stop</button>
			<button class='bg-blue-700 hover:bg-blue-800 text-white rounded p-2' type='button' @click='countup' v-if='!countingUp'>Count Up</button>
			<button class='bg-blue-700 hover:bg-blue-800 text-white rounded p-2' type='button' @click='countdown' v-if='countingUp'>Count Down</button>
			<button class='bg-red-700 hover:bg-red-800 text-white rounded p-2' type='button' @click='remove'>Remove</button>	
		</div>
	</div>
</template>

<style>
	.iconify--el {
		display: inline
	}
</style>

<script>
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
			totalSeconds: 0,
			interval: () => {},
			title: 'Timer',
			countingUp: true,
			default: 0
		}
	},
	methods: {
		start() {
			this.interval = setInterval(() => {
				if (this.countingUp) this.totalSeconds += 1
				else {
					if (this.totalSeconds) this.totalSeconds -= 1
				}
				const s = this.totalSeconds
				this.updateDisplay()
			}, 1000)
			this.isStarted = true
		},
		pause() {
			clearInterval(this.interval)
			this.updateDisplay()
			this.isStarted = false
		},
		stop() {
			this.pause()
			this.totalSeconds = this.default
			this.updateDisplay()
			this.isStarted = false
		},
		remove() {
			this.$emit('remove', this.id)
		},
		updateDisplay() {
			const s = this.totalSeconds
			this.s = s % 60
			this.m = Math.floor(s/60) % 60
			this.h = Math.floor(s/3600) % 24
			this.d = Math.floor(s/86400)
			let display = `${(this.s+'').length === 1 ? 0 : ''}${this.s}`
			display = `${(this.m+'').length === 1 ? 0 : ''}${this.m}:` + display
			display = `${(this.h+'').length === 1 ? 0 : ''}${this.h}:` + display
			if (this.d) display = `${(this.d+'').length === 1 ? 0 : ''}${this.d}:` + display
			this.display = display
			// console.log(display)
		},
		rename() {
			this.title = prompt('Enter a new title for this timer.')
		},
		countup() {
			this.countingUp = true
		},
		countdown() {
			this.countingUp = false
		},
		retime() {
			let input = prompt('Enter the new time in seconds.')
			if (!Number.isNaN(Number(input))) {
				this.totalSeconds = Number(input)
				this.default = Number(input)
				this.updateDisplay()
			}
		},
	},
}
</script>
