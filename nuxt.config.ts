// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		pageTransition: { name: "page", mode: "out-in" },
		layoutTransition: { name: "layout", mode: "out-in" },
	},

	future: {
		compatibilityVersion: 4,
	},
	ssr: false,
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: [
		"@nuxt/fonts",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"@nuxt/icon",
	],
	tiptap: {
		prefix: "Tiptap", //prefix for Tiptap imports, composables not included
	},

	runtimeConfig: {
		amulet: {
			allowUserSignups: true,
			siteName: "Amulet",
		},
		tiptap: {
			jwtSecret: "",
			appID: "",
		},
		public: {
			// Instant Configuration
			instant: {
				appID: process.env.INSTANT_APP_ID as string, // the app id
				devtool: false, // show or hide instantDB devtool
			},
		},
	},

	tailwindcss: {
		exposeConfig: true,
		editorSupport: true,
	},

	colorMode: {
		classSuffix: "",
	},

	imports: {
		imports: [
			{
				from: "tailwind-variants",
				name: "tv",
			},
			{
				from: "tailwind-variants",
				name: "VariantProps",
				type: true,
			},
			{
				from: "vue-sonner",
				name: "toast",
				as: "useSonner",
			},
		],
	},

	build: {
		transpile: ["vue-sonner"],
	},

	vueTransitions: {
		// The same options as in the plugin itself.
		// You will get an autocomplete using Nuxt 3.
	},
});
