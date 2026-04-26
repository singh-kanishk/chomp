import express ,{type Request,type Response} from 'express';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import cors from 'cors'

export const db = drizzle(process.env.DATABASE_URL!);


const app = express();
const PORT = 3001;

app.use(cors())

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});