import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    // path to your schema
    schema: 'prisma/schema.prisma',

    // optional but nice to be explicit
    migrations: {
        path: 'prisma/migrations',
    },

    // THIS replaces `url = env("DATABASE_URL")` in schema.prisma
    datasource: {
        url: env('DATABASE_URL'),
    },
});
