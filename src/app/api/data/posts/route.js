import clientPromise from "@/database/mongodb";

export async function GET() {
    try {
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("posts");

        const posts = await collection.find().toArray();

        return Response.json(posts);
    } catch (error) {
        console.error("Database connection error:", error);
        return Response.json({ error: "Failed to connect to database" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("posts");

        // find max user_id
        const result = await collection.aggregate([
            {
                $group: {
                    _id: null,
                    maxPostId: { $max: "$post_id" }, 
                },
            },
        ]).toArray();
        
        const post_id = result.length === 0 ? 1 : result[0].maxPostId + 1
        
        await collection.insertOne({
            post_id: post_id,
            post_content: body.post_content,
            author_id: body.author_id,
            like: 0
        });
        return Response.json({ message: "insert successed", content: body }, { status: 200 });
    } catch (error) {
      console.error("Database connection error:", error);
      return Response.json({ error: "Failed to connect to database" }, { status: 500 });
    }
}

