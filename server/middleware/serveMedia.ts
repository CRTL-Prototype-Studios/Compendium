// server/middleware/serveMedia.ts
import { serveStatic } from 'h3'
import { readFile, stat } from "node:fs/promises";
import { join } from "pathe";

const publicDir = "media";

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event)

    // Only handle requests that start with /media
    if (url.pathname.startsWith('/media')) {
        const filePath = url.pathname.slice(7) // Remove '/media/' from the start

        return serveStatic(event, {
            getContents: () => readFile(join(publicDir, filePath)),
            getMeta: async () => {
                const stats = await stat(join(publicDir, filePath)).catch(() => {});

                if (!stats || !stats.isFile()) {
                    return;
                }

                return {
                    size: stats.size,
                    mtime: stats.mtimeMs,
                };
            },
        });
    }
})