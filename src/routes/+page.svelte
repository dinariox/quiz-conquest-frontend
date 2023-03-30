<script lang="ts">
	import Logo from '../components/Logo.svelte';
</script>

<svelte:head>
	<title>Quiz Conquest</title>
</svelte:head>
<main>
	<Logo size="lg" />

	<a href="/join">
		<span>Mitspielen</span>
		<svg
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
			/>
		</svg>
	</a>
</main>

<style>
	main {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 4rem;
		min-height: 100vh;
	}

	a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		text-decoration: none;
		color: black;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		border: 2px solid #4ed1b5;
		background-color: #67f2d1;
	}

	a:hover {
		background-color: #4ed1b5;
	}

	span {
		font-size: 1.75rem;
		padding-top: 0.2rem;
	}

	svg {
		width: 2.5rem;
		height: 2.5rem;
	}
</style>
