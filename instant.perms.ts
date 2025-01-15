// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/core";

const rules = {
    /**
     * Welcome to Instant's permission system!
     * Right now your rules are empty. To start filling them in, check out the docs:
     * https://www.instantdb.com/docs/permissions
     *
     * Here's an example to give you a feel:
     * posts: {
     *   allow: {
     *     view: "true",
     *     create: "isOwner",
     *     update: "isOwner",
     *     delete: "isOwner",
     *   },
     *   bind: ["isOwner", "data.creator == auth.uid"],
     * },
     */
    galleries: {
        bind: ["isOwner", "data.owner.owner.id == auth.uid"],
        allow: {
            view: "true",
            $default: "isOwner",
        },
    },
    $users: {
        allow: {
            $default: "true",
            update: "false",
        },
    },
    profiles: {
        bind: ["isOwner", "data.owner.id == auth.uid"],
        allow: {
            view: "true",
            $default: "isOwner",
        },
    },
} satisfies InstantRules;

export default rules;
