import clientPromise from "@/database/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {

    try {
        const body = await request.json();
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection('users');
        
        await collection.updateOne(
            { _id: ObjectId.createFromHexString(body.user_id) },
            { $set: { username: body.username }}
        )

        return Response.json({ message: `Update ${body.user_id}'s username to ${body.username}`, content: body }, { status: 200 });
    } catch (error) {
        return Response.json({ Error: error }, { status: 500 });
    }
    
    
}

app.post('/api/data/users', async (req, res) => {
    const { author_ids } = req.body;

    try {
        const users = await db.collection('users').find({
            _id: { $in: author_ids }
        }).toArray();

        // Return only the necessary fields: id and username
        const usersData = users.map(user => ({
            id: user._id,
            username: user.username,
        }));

        res.json(usersData);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});





