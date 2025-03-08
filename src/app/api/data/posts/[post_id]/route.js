import clientPromise from "../../../../lib/mongodb";

export async function GET(request, { params }) {
  try {
    const db = (await clientPromise).db(process.env.MONGO_DB);
    const collection = db.collection("posts");

    const post = await collection.findOne({ post_id: parseInt(params.post_id) });
    console.log(post.post_id);

    return Response.json(post);
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}