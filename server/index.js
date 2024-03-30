import app from "./src/app.js";
import { config } from 'dotenv';
import { connection } from "./src/db.js";

config();

async function main() {
    try {
        await connection();
        app.listen(process.env.PORT, () => console.log(`El servidor se encuentra activo en el puerto ${process.env.PORT}`));
    } catch (error) {
        console.error(error);
    }
}

main();
