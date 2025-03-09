"use server"

import clientPromise from "@/database/mongodb";

export async function GET(request, { params }) {
  try {
    const db = (await clientPromise).db(process.env.MONGO_DB);
    const collection = db.collection("users");

    const user = await collection.findOne({ user_id: parseInt(params.user_id) });

    return Response.json(user);
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}
