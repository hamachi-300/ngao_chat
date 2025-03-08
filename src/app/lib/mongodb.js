
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;
let client;

// check mongodb is created connection 
if (!global._mongoClientPromise) {
    // create mongodb client for interact with mongodb
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1, // define api version
            strict: true, // use stable api [ api not break when mongodb is upgraded ]
            deprecationErrors: true // deprecate feature will error
        },
    });
    // store mongodb connection in global scope
    global._mongoClientPromise = client.connect();
}

let clientPromise = global._mongoClientPromise;

export default clientPromise;