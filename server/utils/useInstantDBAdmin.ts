import { id, init, lookup } from "@instantdb/admin";
import schema, { type AppSchema } from "~~/instant.schema";

export const useInstantDBAdmin = () => {
	function initAdminDB() {
		// Nuxt Config
		const config = useRuntimeConfig();
		const APP_ID = config.public.instant.appID;
		const DEVTOOL = config.public.instant.devtool;
		const ADMIN_KEY = config.instant_admin_key;

		return init({ appId: APP_ID, adminToken: ADMIN_KEY as string, schema });
	}

	let db: ReturnType<typeof initAdminDB> = initAdminDB();

	return {
		db,
		id,
		lookup,
	};
};
