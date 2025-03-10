import clientPromise from "@/database/mongodb";

export async function GET(request, { params }) {

    try {
        const db = (await clientPromise).db(process.env.MONGO_DB);
        const collection = db.collection("posts");
        
        const result = await collection.find(
            { author_id: (await params).user_id}
        ).toArray();

        return Response.json(result);
    } catch (error) {
        console.error(error);
        return Response.json({ Error: error }, { status: 500 });
    }
}