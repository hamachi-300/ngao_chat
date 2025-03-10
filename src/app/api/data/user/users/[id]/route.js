import { ObjectId } from "mongodb";
import clientPromise from "@/database/mongodb";

export async function GET(request, { params }) {

    try {
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("users");

        console.log((await params).id);
        
        const result = await collection.findOne(
            { _id: ObjectId.createFromHexString((await params).id) }
        );

        return Response.json(result, { status: 200 });
    } catch (error) {
        //console.error(error);
        return Response.json({ Error: error }, { status: 500 });
    }
}