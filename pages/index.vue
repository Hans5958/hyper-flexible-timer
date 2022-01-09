<template>
	<main class='bg-gradient-to-r from-cyan-500 to-blue-500 h-full min-h-screen w-full'>
		<div class='wrapper p-2 2xl:p-4'>
			<div class='timers grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 2xl:gap-4 mb-2'>
				<Timer v-for="field in fields" :id="field.id" :key="field.id" @remove='removeTimer'/>
				<div class='bg-white p-2 h-auto w-auto rounded group cursor-pointer hover:shadow-2xl transition ease-in-out' @click='addTimer'>
					<div class='border-2 border-gray-300 border-dashed focus:border-solid group-hover:border-gray-700 h-full w-full rounded flex items-center justify-center transition ease-in-out'>
						<p class='group-hover:text-gray-900 text-gray-500 text-lg my-10 transition ease-in-out'>Add more timers</p>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	name: 'IndexPage',
	data() {
		return {
			timerCount: 0,
			fields: [
				{id: 0}
			]
		}
	},
	methods: {
		addTimer() {
			this.timerCount++
			this.fields.push({
				id: this.timerCount++
			})
		},
		removeTimer(id) {
			console.log(id)
			const index = this.fields.findIndex(f => f.id === id)
			console.log(index)
      		this.fields.splice(index,1)        
		}
	},
}
</script>
