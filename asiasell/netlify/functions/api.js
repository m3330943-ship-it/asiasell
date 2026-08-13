const { MongoClient } = require('mongodb');

// الرابط السحري جاهز ومربوط بقاعدة البيانات مالتك
const uri = "mongodb+srv://mohammed:mohammed12345@cluster222.k3a1zlp.mongodb.net/attendance_db?retryWrites=true&w=majority&appName=Cluster222"; 
const client = new MongoClient(uri);

exports.handler = async (event) => {
    // إعدادات السماح بمرور البيانات (CORS)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    try {
        await client.connect();
        const db = client.db('attendance_db'); // اسم قاعدة البيانات
        const collection = db.collection('records'); // اسم الجدول

        // جلب البيانات (GET)
        if (event.httpMethod === 'GET') {
            const records = await collection.find({}).toArray();
            return { statusCode: 200, headers, body: JSON.stringify(records) };
        }
        // إضافة حضور جديد (POST)
        if (event.httpMethod === 'POST') {
            const data = JSON.parse(event.body);
            await collection.insertOne(data);
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }
        // تصفير الجدول (DELETE)
        if (event.httpMethod === 'DELETE') {
            await collection.deleteMany({});
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    } finally {
        await client.close();
    }
};