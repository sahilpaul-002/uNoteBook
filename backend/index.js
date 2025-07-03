import { connectToMongoDB } from "./db.js";
import express from 'express';
import { router as authRouter }  from "./routes/auth.js";
import { router as notesRouter} from "./routes/notes.js";

// Connect to MongoDB
const client = connectToMongoDB();

// Initialize Express app
const app = express()
const port = 5000

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth", authRouter);
app.use('/api/notes', notesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})