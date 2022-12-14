<script>
	import ear from "rabbit-ear";
	import FileInfo from "./FileInfo.svelte";
	// import Examples from "./Examples.svelte";

	import { averageEdgeLength } from "../../src/graph/general";

	export let origami = {};
	export let frames = [];
	export let selectedFrame = 0;
	export let perspective = "orthographic";
	export let viewClass = "creasePattern";
	export let strokeWidth = 0.0025;
	export let layerNudge = 1e-5;
	export let opacity = 1.0;
	export let fov = Math.PI / 4;
	export let flipCameraZ = false;
	export let frontColor = "#57f";
	export let backColor = "#fff";
	export let showFoldedCreases = false;
	export let showFoldedFaces = true;
	export let showFoldedFaceOutlines = true;
	export let loadFOLD = () => {};

	let selectedExample;

	const fileDialogDidLoad = (string, filename, mimeType) => {
		try {
			loadFOLD(JSON.parse(string));
			selectedExample = null;
		}
		catch (error) { window.alert(error); }
	};

	// set the view settings (crease pattern / folded, etc...)
	// depending on if the FOLD object contains frame_classes.
	const updateViewSettings = () => {
		if (origami.frame_classes) {
			if (origami.frame_classes.includes("creasePattern")) {
				perspective = "orthographic";
				viewClass = "creasePattern";
			} else if (origami.frame_classes.includes("foldedForm")) {
				perspective = "perspective";
				viewClass = "foldedForm";
			}
		}
		if (origami) {
			// find a decent stroke width
			// (do this even if we cannot infer creasePattern from frame_classes)
			const avgEdgeLen = averageEdgeLength(origami);
			// invert this: Math.pow(2, strokeWidthSlider) / 100000;
			strokeWidthSlider = !avgEdgeLen
				? 0.1
				: Math.log2((avgEdgeLen * 0.02) * 100000);
		}
		if (origami) {
			// find a decent spacing between layers (layerNudge)
			const bounds = ear.graph.getBoundingBox(origami);
			if (bounds && bounds.span) {
				const maxSpan = Math.max(...bounds.span);
				// layerNudgeSlider = Math.log2((maxSpan * 0.001) * 100000);
				layerNudgeSlider = Math.log2((maxSpan * 0.0005) * 100000);
			}
		}
	};

	$: updateViewSettings(origami);

	let files;
	$: if (files) {
		const file = files[0];
		let mimeType, filename;
		const reader = new FileReader();
		reader.onload = loadEvent => fileDialogDidLoad(loadEvent.target.result, filename, mimeType);
		if (files.length) {
			mimeType = files[0].type;
			filename = files[0].name;
			reader.readAsText(files[0]);
		}
	}

	let strokeWidthSlider = 5;
	$: strokeWidth = Math.pow(2, strokeWidthSlider) / 100000;

	let layerNudgeSlider = 6;
	$: layerNudge = Math.pow(2, layerNudgeSlider) / 1000000;

</script>

<div class="settings">
	<h3>load FOLD</h3>
	<input type="file" bind:files>

	<hr />

	<!-- <Examples {loadFOLD} bind:selectedExample={selectedExample} />
	<hr /> -->

	<h3>file info</h3>

	{#if frames.length > 1}
		<p>
			frame: <span class="value">{selectedFrame+1}/{frames.length}</span>
		</p>
		<div>
			<input
				type="range"
				min=0
				max={frames.length - 1}
				step=1
				bind:value={selectedFrame}/>
		</div>
	{/if}

	<FileInfo FOLD={origami} {frames} {selectedFrame} />

	<hr />

	<h3>viewport</h3>
	<!-- perspective (orthographic/perspective) -->
	<input
		type="radio"
		bind:group={perspective}
		name="radio-webgl-perspective"
		id="radio-webgl-perspective-orthographic"
		value="orthographic">
	<label for="radio-webgl-perspective-orthographic">orthographic</label>
	<input
		type="radio"
		bind:group={perspective}
		name="radio-webgl-perspective"
		id="radio-webgl-perspective-perspective"
		value="perspective">
	<label for="radio-webgl-perspective-perspective">perspective</label>
	<br />
	<!-- field of view -->
	{#if perspective === "perspective"}
		<span>field of view:</span>
		<input type="text" placeholder="field of view" bind:value={fov}>
		<br/>
	{/if}
	<!-- flip model over -->
	<span>flip over</span>
	<input type="checkbox" bind:checked={flipCameraZ} />

	<hr />

	<h3>style</h3>
	<!-- view style (folded/cp) -->
	<input
		type="radio"
		name="radio-view-class"
		id="radio-view-class-cp"
		bind:group={viewClass}
		value="creasePattern">
	<label for="radio-view-class-cp">crease pattern</label>
	<input
		type="radio"
		name="radio-view-class"
		id="radio-view-class-folded"
		bind:group={viewClass}
		value="foldedForm">
	<label for="radio-view-class-folded">folded form</label>
	<br />
	<!-- stroke width -->
	{#if viewClass === "creasePattern"}
		<span>stroke width</span><input
			type="range"
			min="1"
			max="20"
			step="0.01"
			bind:value={strokeWidthSlider} />
	{/if}
	<!-- folded form face style -->
	{#if viewClass === "foldedForm"}
		<span>opacity</span><input
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={opacity} />
		<br />
		<span>front</span><input type="text" bind:value={frontColor} />
		<span>back</span><input type="text" bind:value={backColor} />
	{/if}
	<!-- folded form edge style -->
	{#if viewClass === "foldedForm"}
		<br/>
		<span>show faces</span>
		<input
			type="checkbox"
			bind:checked={showFoldedFaces} />
		<br/>
		<span>face outlines</span>
		<input
			type="checkbox"
			bind:checked={showFoldedFaceOutlines}
			disabled={!showFoldedFaces} />
		<br/>
		<span>show creases</span>
		<input
			type="checkbox"
			bind:checked={showFoldedCreases} />
		<br/>
		<span>stroke width</span><input
			type="range"
			min="1"
			max="20"
			step="0.01"
			bind:value={strokeWidthSlider}
			disabled={!showFoldedCreases} />
		<br/>
	{/if}
	<!-- nudge layers for origami with layer orders -->
	{#if viewClass === "foldedForm" && origami !== undefined}
		{#if origami.faceOrders || origami.faces_layer}
			<hr />
			<h3>overlapping faces</h3>
			<span>explode layers</span><input
				type="range"
				min="1"
				max="20"
				step="0.01"
				bind:value={layerNudgeSlider} />
			<br />
			<input type="text" class="long-input" bind:value={layerNudge} />
		{/if}
	{/if}

</div>

<style>
	.settings {
		background-color: #0002;
		z-index: 2;
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.5rem;
		overflow-y: auto;
		max-height: calc(100vh - 1rem);
	}
	h3 {
		margin: 0;
		padding: 0;
	}
	input[type=text] {
		width: 4rem;
	}
	input[type=text].long-input { width: 8rem; }
	span + input[type=text] {
		margin-left: 0.5rem;
	}
</style>
