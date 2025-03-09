import clientPromise from "@/database/mongodb";

export async function GET() {
    try {
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("comments");

        const comments = await collection.find().toArray();

        return Response.json(comments);
    } catch (error) {
        console.error("Database connection error:", error);
        return Response.json({ error: "Failed to connect to database" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("comments");

        // find max user_id
        const result = await collection.aggregate([
            {
                $group: {
                    _id: null,
                    maxCommentId: { $max: "$comment_id" }, 
                },
            },
        ]).toArray();
        
        const comment_id = result.length === 0 ? 1 : result[0].maxCommentId + 1
        
        await collection.insertOne({
            comment_id: comment_id,
            post_id: body.post_id,
            author_id: body.author_id,
            comment_content: body.comment_content,
            like: [],
            is_cleared: false
        });
        return Response.json({ message: "insert successed", content: body }, { status: 200 });
    } catch (error) {
      console.error("Database connection error:", error);
      return Response.json({ error: "Failed to connect to database" }, { status: 500 });
    }
}

