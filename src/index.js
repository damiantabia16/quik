import app from "./src/app.js";
import { PORT } from "./src/config.js";
import { connection } from "./src/db.js";

async function main() {
    try {
        await connection();
        app.listen(PORT);
    } catch (error) {
        console.error(error);
    }
}

main();
