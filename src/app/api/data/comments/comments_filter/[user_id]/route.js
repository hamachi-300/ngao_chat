import clientPromise from "@/database/mongodb";

export async function GET(request, {params}) {
    try {
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("comments");

        const user_id = params.user_id;
        const comments = await collection
        .aggregate([
            {
            $lookup: {
                from: "posts", // Join with posts collection
                localField: "post_id", // comments.post_id
                foreignField: "post_id", // posts.author_id
                as: "postDetails",
            },
            },
            { $unwind: "$postDetails" }, // Flatten postDetails array
            { 
                $match: {
                    "postDetails.author_id": user_id, 
                    // comments not include comments of owner post
                    "author_id": { $ne: user_id },
                    "is_cleared": false
                } 
            }, // Filter by author_id
        ])
        .toArray();

        return Response.json(comments);
    } catch (error) {
        console.error("Database connection error:", error);
        return Response.json({ error: "Failed to connect to database" }, { status: 500 });
    }
}