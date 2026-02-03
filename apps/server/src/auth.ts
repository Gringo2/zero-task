
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
            // Map Better Auth standard tables to our distinct schema if needed
            // Default mapping works for the schema we defined
        }
    }),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
});
