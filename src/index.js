import app from "./app.js";
import { PORT } from "./config.js";
import { connection } from "./db.js";

async function main() {
    try {
        await connection();
        app.listen(PORT);
    } catch (error) {
        console.error(error);
    }
}

main();
