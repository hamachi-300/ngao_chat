import clientPromise from "@/database/mongodb";

export async function GET(request, { params }) {
  try {
    const db = (await clientPromise).db(process.env.MONGO_DB);
    const collection = db.collection("posts");

    const post = await collection.findOne({ post_id: parseInt((await params).post_id) });

    return Response.json(post);
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const db = (await clientPromise).db(process.env.MONGO_DB);
    const collection = db.collection("posts");

    await collection.updateOne(
                { post_id: parseInt((await params).post_id)},
                body.action === 'like' ? 
                  { $addToSet: { like: body.user_id }} :
                  body.action === 'unlike' ?
                    { $pull: { like: body.user_id } } :
                    {}
            )

    return Response.json({}, { status: 200 });
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    
    const db = (await clientPromise).db(process.env.MONGO_DB);

    await db.collection("posts").deleteOne({ post_id: parseInt((await params).post_id) });
    await db.collection("comments").deleteMany({ post_id: parseInt((await params).post_id) });

    return Response.json({}, { status: 200 });

  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}