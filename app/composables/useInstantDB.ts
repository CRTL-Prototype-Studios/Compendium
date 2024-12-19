import {init, tx, id, lookup, InstantVue} from "@dorilama/instantdb-vue";

// Schema Typescript Types
// !Not the same as schema as code!
import type { Schema } from "~/instant.schema.types";

let db: InstantVue<Schema>;

export const useInstantDB = () => {
	// Nuxt Config
	const config = useRuntimeConfig();
	const APP_ID = config.public.instant.appID;
	const DEVTOOL = config.public.instant.devtool;

	// Initialise DB just once
	function initDB() {
		if (db) return;
		db = init<Schema>({ appId: APP_ID, devtool: DEVTOOL });
	}
	initDB();

	return {
		db,
		tx,
		id,
		lookup
	};
};
