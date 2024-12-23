import { id, init, lookup } from "@dorilama/instantdb-vue";
import schema, { type AppSchema } from "~/../instant.schema";

function initDB() {
	// Nuxt Config
	const config = useRuntimeConfig();
	const APP_ID = config.public.instant.appID;
	const DEVTOOL = config.public.instant.devtool;

	return init({ appId: APP_ID, devtool: DEVTOOL, schema: schema as AppSchema });
}

let db: ReturnType<typeof initDB>;

export const useInstantDB = () => {
	if (!db) {
		db = initDB();
	}

	return {
		db,
		id,
		lookup,
	};
};
