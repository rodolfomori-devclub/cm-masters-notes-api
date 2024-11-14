import mongoose from 'mongoose';

export async function setupMongo() {
	try {
		if (mongoose.connection.readyState === 1) {
			return;
		}

		console.log('🎲 Connecting to database...');

		await mongoose.connect(String(process.env.MONGODB_URL));

		console.log('🔥 Database connected!');
	} catch (err) {
		throw new Error('❌ Database not connected.');
	}
}
