"use server"

import clientPromise from "@/database/mongodb";
import { ObjectId } from "mongodb";

// increase notify
export async function PATCH(request, { params }) {
    try {

        // Parse the request body as JSON (make sure content type is JSON)
        const updateFields = await request.json();
  
        if (!updateFields) {
            return new Response("Invalid input data", { status: 400 });
        }
  
        // Connect to the database
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("users");
  
        // Increase the notify field 
        if (updateFields.notify != null) {
            updateFields.notify = updateFields.notify + 1;
        } else {
            updateFields.notify = 1;
        }
  
        console.log(updateFields.notify)

        // Perform the update operation
        const result = await collection.updateOne(
            { _id: ObjectId.createFromHexString(params.user_id) },
            { $set: {notify: updateFields.notify} }
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