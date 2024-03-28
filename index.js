import app from "./src/app.js";
import { PORT } from "./src/config.js";
import { connection } from "./src/db.js";

async function main() {
    try {
        await connection();
        app.listen(PORT, () => console.log('El servidor se encuentra activo en el puerto 4000'));
    } catch (error) {
        console.error(error);
    }
}

main();
