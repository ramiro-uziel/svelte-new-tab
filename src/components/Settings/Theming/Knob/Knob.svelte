<script lang="ts">
	import knobdrag, { makeValueStore } from './knobdrag.js';

	export let min = 0;
	export let max = 100;
	export let step = (max - min) / 100;
	export let value = (min + max) / 2;
	export let rotRange = 2 * Math.PI * 0.83;

	const valueStore = makeValueStore(value, (newValue) => (value = newValue));
	$: valueStore.set(value);
	let inputElem: HTMLInputElement;
	$: knobParams = { inputElem, min, max, step, valueStore };

	export let startRotation = -Math.PI * 0.83;

	$: valueRange = max - min;
	$: rotation = startRotation + ((value - min) / valueRange) * rotRange;
</script>

<div
	class="block w-12 h-12 p-0 rounded-full bg-transparent border border-1 border-dashed relative select-none"
	style="transform: rotate(calc({rotation}rad)); transform-origin: 50% 50%;"
	use:knobdrag={knobParams}
>
	<div
		class="w-1 h-2.5 bg-white rounded-full absolute"
		style="top: 5px; left: 50%; transform: translateX(-50%);"
	></div>
</div>
