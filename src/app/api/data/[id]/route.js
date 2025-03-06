import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI || "mongodb+srv://tuwaris:aUh1fCNMrFIMPfmd@tuwaris.5ynbx.mongodb.net/?retryWrites=true&w=majority&appName=Tuwaris";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function GET(request, { params }) {
  try {
    const db = (await clientPromise).db("books"); // Change to your actual DB name
    const collection = db.collection("book_infos"); // Change to your actual collection name

    // Fetch user data from MongoDB (example query)
    const user = await collection.findOne({ id: parseInt(params.id) });
    let title = user.title;

    return Response.json({ 
        message: `Hello user ID: ${params.id}`,
        content: title
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}
