<script lang="ts">
	export let size: 'sm' | 'lg' = 'sm';
	export let isModerator: boolean = false;
</script>

<div class="logo" style="--multiply: {size === 'sm' ? '1' : '2'}">
	<h1>QUIZ CONQUEST</h1>
	{#if isModerator}
		<h2>MODERATOR</h2>
	{/if}
</div>

<style>
	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	h1 {
		font-family: 'Righteous';
		user-select: none;
		text-shadow: #67f2d1 calc(var(--multiply) * 2px) calc(var(--multiply) * 2px) 0px,
			#e6ff6e calc(var(--multiply) * 4px) calc(var(--multiply) * 4px) 0px,
			#ff6e6e calc(var(--multiply) * 6px) calc(var(--multiply) * 6px) 0px;
		font-size: calc(var(--multiply) * 2.5rem);
		color: white;
	}

	h2 {
		font-family: 'Righteous';
		user-select: none;
		font-size: calc(var(--multiply) * 1.25rem);
		color: #ff6e6e;
		padding-top: 0.5rem;
	}
</style>
