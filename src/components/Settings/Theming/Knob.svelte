<script lang="ts">
	import { onDestroy } from 'svelte';

	export let value: number, min: number, max: number;
	export let rotRange = 2 * Math.PI * 0.83;
	export let pixelRange = 200;
	export let trackpadMultiplier = 0.50;
	export let startRotation = -Math.PI * 0.83;

	let startY: number, startValue: number;
	let isShiftHeld = false;

	$: valueRange = max - min;
	$: rotation = startRotation + ((value - min) / valueRange) * rotRange;
	$: effectivePixelRange = isShiftHeld ? pixelRange * 4 : pixelRange;

	function clamp(num: number, min: number, max: number) {
		return Math.max(min, Math.min(num, max));
	}

	function pointerMove(event: PointerEvent) {
		event.stopPropagation();
		const valueDiff = (valueRange * (event.clientY - startY)) / effectivePixelRange;
		value = clamp(startValue - valueDiff, min, max);
	}

	function pointerDown(event: PointerEvent) {
		event.stopPropagation();
		startY = event.clientY;
		startValue = value;
		window.addEventListener('pointermove', pointerMove);
		window.addEventListener('pointerup', pointerUp);
	}

	function pointerUp(event: PointerEvent) {
		event.stopPropagation();
		window.removeEventListener('pointermove', pointerMove);
		window.removeEventListener('pointerup', pointerUp);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Shift') {
			isShiftHeld = true;
		}
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Shift') {
			isShiftHeld = false;
		}
	}

	function handleWheel(event: WheelEvent) {
        event.preventDefault();
        const valueDiff = (valueRange * -event.deltaY) / effectivePixelRange * trackpadMultiplier;
        value = clamp(value - valueDiff, min, max);
    }


	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('keyup', handleKeyUp);
	});
</script>

<div
	class="block w-12 h-12 p-0 rounded-full bg-transparent border border-1 border-dashed relative select-none"
	style="transform: rotate(calc({rotation}rad)); transform-origin: 50% 50%;"
	on:pointerdown={pointerDown}
	on:wheel={handleWheel}

>
	<div
		class="w-1 h-2.5 bg-white rounded-full absolute"
		style="top: 5px; left: 50%; transform: translateX(-50%);"
	></div>
</div>
