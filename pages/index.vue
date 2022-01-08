<template>
	<div class='wrapper m-2'>
		<div class='timers grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 mb-2'>
			<Timer v-for="field in fields" :id="field.id" :key="field.id" @remove='removeTimer'/>
			<div class='border-2 border-gray-300 border-dashed hover:border-gray-700 h-auto w-auto rounded flex items-center justify-center group' @click='addTimer'>
				<p class='group-hover:text-gray-900 text-gray-500 text-lg my-10' >Add more timers</p>
			</div>
		</div>
	</div>
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
