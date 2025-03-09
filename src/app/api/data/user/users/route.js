import { ObjectId } from "mongodb";
import clientPromise from "@/database/mongodb";

export async function POST(request) {

    const body = await request.json();
    const db = (await clientPromise).db(process.env.MONGO_DB);
    const collection = db.collection('users');

    const objectIds = body.author_ids.map(id => ObjectId.createFromHexString(id));

    try {
        const users = await collection.find({
            _id: { $in: objectIds }
        }).toArray();

        // Return only the necessary fields: id and username
        const usersData = users.map(user => ({
            id: user._id,
            username: user.username,
        }));

        return Response.json(usersData, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return Response.json({ Error: error }, { status: 500 });
    }
}