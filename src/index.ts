import 'dotenv';
import app from './server';
import { database } from './config/database';
const PORT = 3000;

app.listen(PORT, async () => {
    await database()
    console.log(`listening on: http://localhost:${PORT}`);
})