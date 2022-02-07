<template>
	<div class='footer p-3 flex-none bg-white/75 flex content-center flex-col sm:flex-row'>
		<div class='flex flex-col justify-center grow mb-2 sm:mb-0'>
			<h1 class='text-2xl'><client-only><Icon icon="bi:stopwatch-fill" :inline="true" /></client-only> The Hyper Flexible Timer</h1>
		</div>
		<div class='text-right text-sm'>
			<p>
				<a href='/about' target='_blank' class='text-sky-600 hover:underline'>About</a>
				–
				<a href='https://github.com/Hans5958/hyper-flexible-timer' target='_blank' class='text-sky-600 hover:underline'>Source Code</a>
			</p>
			<p>Version {{ $config.appVersion }} – Copyright © 2021, Hans5958</p>
		</div>
	</div>
</template>

<script>
import { Icon } from '@iconify/vue2';

export default {
	components: {
		Icon
	}
}
</script>