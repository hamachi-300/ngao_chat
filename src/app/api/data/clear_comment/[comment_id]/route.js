"use server"

import clientPromise from "../../../../lib/mongodb";

// clear post
export async function GET(request, { params }) {
    try {
        // Connect to the database
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("comments");

        // Perform the update operation
        const result = await collection.updateOne(
            { comment_id: parseInt(params.comment_id) },
            { $set: {is_cleared: true} }
        );
  
        // Check if the update was successful
        if (result.modifiedCount === 0) {
            console.log(result)
            return new Response("No documents updated", { status: 404 });
        }
  
        return new Response(
            JSON.stringify({ message: "Notify incremented successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Database connection error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to connect to database" }),
            { status: 500 }
        );
    }
}