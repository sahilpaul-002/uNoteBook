import { connectToMongoDB } from "./db.js";
import express from 'express';
import cors from 'cors';
import { router as authRouter }  from "./routes/auth.js";
import { router as notesRouter} from "./routes/notes.js";

// Connect to MongoDB
const client = connectToMongoDB();

// Initialize Express app
const app = express()
const port = 5000

// Enable cors
app.use(cors())

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth", authRouter);
app.use('/api/notes', notesRouter);

app.listen(port, () => {
  console.log(`uNote App listening on port http://localhost:${port}`)
})