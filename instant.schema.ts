// Docs: https://www.instantdb.com/docs/schema

import { i } from "@instantdb/core";

const _schema = i.schema({
	entities: {
		$users: i.entity({
			email: i.string().unique().indexed(),
		}),
		files: i.entity({
			created_at: i.date(),
			directory: i.boolean().indexed(),
			path: i.string().indexed(),
			pseudoDir: i.string().indexed(),
			updated_at: i.date(),
			fileName: i.string().indexed(),
			url: i.string().indexed(),
		}),
		galleries: i.entity({
			created_at: i.date(),
			name: i.string(),
			public: i.boolean().indexed(),
			updated_at: i.date(),
		}),
		media: i.entity({
			created_at: i.date(),
			desc: i.string(),
			name: i.string(),
			updated_at: i.date(),
		}),
		profiles: i.entity({
			created_at: i.date(),
			updated_at: i.date(),
			username: i.string().unique(),
		}),
	},
	links: {
		galleriesOwner: {
			forward: {
				on: "galleries",
				has: "one",
				label: "owner",
			},
			reverse: {
				on: "profiles",
				has: "many",
				label: "galleries",
			},
		},
		mediaContent: {
			forward: {
				on: "media",
				has: "one",
				label: "content",
			},
			reverse: {
				on: "files",
				has: "many",
				label: "media",
			},
		},
		profilesAvatar: {
			forward: {
				on: "profiles",
				has: "one",
				label: "avatar",
			},
			reverse: {
				on: "files",
				has: "one",
				label: "profile_avatar",
			},
		},
		profilesOwner: {
			forward: {
				on: "profiles",
				has: "one",
				label: "owner",
			},
			reverse: {
				on: "$users",
				has: "one",
				label: "profile",
			},
		},
	},
	// If you use presence, you can define a room schema here
	// https://www.instantdb.com/docs/schema#defining-rooms
	rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
