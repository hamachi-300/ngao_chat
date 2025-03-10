"use server"

import clientPromise from "@/database/mongodb";
import { ObjectId } from "mongodb";


export async function GET(request, { params }) {
  try {
    const db = (await clientPromise).db(process.env.MONGO_DB);
    const collection = db.collection("users");

    // convert id string to ObjectId
    const userId = new ObjectId(params.user_id);
    const user = await collection.findOne({ _id: userId });

    return Response.json(user);
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}