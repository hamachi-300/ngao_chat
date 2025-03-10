import clientPromise from "@/database/mongodb";

export async function GET() {
    try {
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("users");

        const users = await collection.find().toArray();
        console.log(users);

        return Response.json(users);
    } catch (error) {
        console.error("Database connection error:", error);
        return Response.json({ error: "Failed to connect to database" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("users");

        // find max user_id
        const result = await collection.aggregate([
            {
                $group: {
                    _id: null,
                    maxUserId: { $max: "$user_id" }, 
                },
            },
        ]).toArray();
        
        const user_id = result[0].maxUserId + 1
        
        await collection.insertOne({
            user_id: user_id, 
            email: body.email,
            profile_id: user_id % 2
        });
        return Response.json({ message: "insert successed", content: body }, { status: 200 });
    } catch (error) {
      console.error("Database connection error:", error);
      return Response.json({ error: "Failed to connect to database" }, { status: 500 });
    }
}