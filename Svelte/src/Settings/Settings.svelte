<script>
	import Examples from "./Examples.svelte";
	import FileSummary from "./FileSummary.svelte";
	import FileContents from "./FileContents.svelte";
	import StylePanel from "./StylePanel.svelte";
	import {
		tryLoadFile,
		selectedExample,
	} from "../stores/File.js";

	let showFileContents = false;
	let showStyle = false;

	const fileDialogDidLoad = (string, filename, mimeType) => {
		tryLoadFile(string, filename, {});
		$selectedExample = "placeholder";
	};

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
	};
</script>

<div class="settings">

	<input type="file" bind:files>
	<br />
	<Examples />

	<FileSummary />

	<button
		class="dropdown"
		on:click={() => showFileContents = !showFileContents}
		>
		<h3>data</h3>
		{#if showFileContents}
			<span class="triangle">▼</span>
		{/if}
		{#if !showFileContents}
			<span class="triangle rotated">▼</span>
		{/if}
	</button>

	{#if showFileContents}
		<FileContents />
	{/if}

	<button
		class="dropdown"
		on:click={() => showStyle = !showStyle}
		>
		<h3>style</h3>
		{#if showStyle}
			<span class="triangle">▼</span>
		{/if}
		{#if !showStyle}
			<span class="triangle rotated">▼</span>
		{/if}
	</button>

	{#if showStyle}
		<StylePanel />
	{/if}

</div>

<style>
	:global(body) .settings { background-color: #fffc; }
	:global(body.dark) .settings { background-color: #1118; }
	.settings {
		z-index: 2;
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.5rem;
		overflow-y: auto;
		max-height: 100vh;
	}
	h3 {
		margin: 0;
		padding: 0;
	}
	button {
		all: unset;
		display: inline-block;
		width: 100%;
		border-top: 2px solid transparent;
		border-bottom: 2px solid transparent;
		outline: 1px solid transparent;
	}
	button:focus,
	button:focus-visible {
		border-top: 2px solid #38f;
		border-bottom: 2px solid #38f;
		outline: 1px solid #666;
	}
	.dropdown {
		text-transform: uppercase;
		letter-spacing: 0.15rem;
		margin: 0.25rem -0.5rem;
		padding: 0rem 0.5rem;
		border-top: 2px solid #666;
		border-bottom: 2px solid #666;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		cursor: pointer;
	}
	:global(body) .dropdown { background-color: #eee; }
	:global(body) .dropdown:hover { background-color: #ddd; }
	:global(body.dark) .dropdown { background-color: #0002; }
	:global(body.dark) .dropdown:hover { background-color: #fff1; }
	.dropdown h3 {
		font-size: 1rem;
	}
	span.rotated {
		transform: rotate(90deg);
	}
</style>
