<template>
	<div class='wrapper p-2 2xl:p-4 grow'>
		<div class='timers grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 2xl:gap-4 mb-2'>
			<Timer v-for="field in fields" :id="field.id" :key="field.id" @remove='removeTimer(field.id)' ref="fieldRefs"/>
			<div class='bg-white p-2 h-auto w-auto rounded group cursor-pointer hover:shadow-2xl transition ease-in-out' @click="addTimer()">
				<div class='border-2 border-gray-300 border-dashed focus:border-solid group-hover:border-gray-700 h-full w-full rounded flex items-center justify-center transition ease-in-out'>
					<p class='group-hover:text-gray-900 text-gray-500 text-lg my-10 transition ease-in-out'>Add another timer</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

import Timer from './Timer.vue'
import { ref } from 'vue'

let timerCount = 0
const fields = ref([
	{id: 0}
])
const fieldRefs = ref([])

function addTimer() {
	console.log(1)
	timerCount++
	fields.value.push({
		id: timerCount++
	})
}

function removeTimer(id) {
	console.log(id)
	const index = fields.value.findIndex(f => f.id === id)
	console.log(index)
	fields.value.splice(index,1)
}

</script>