// app/api/save-json/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
	try {
		const { coordinates } = await request.json();
		const filePath = path.join(process.cwd(), 'datas', 'coordinates.json');

		await fs.promises.writeFile(
			filePath,
			JSON.stringify({ coordinates }, null, 2),
			'utf8'
		);

		return NextResponse.json({ success: true, path: 'datas/coordinates.json' });
	} catch (err) {
		console.error(err);
		let errorMessage = 'Invalid error';
		if (err instanceof Error) {
			errorMessage = err.message;
		}
		return NextResponse.json(
			{ success: false, error: errorMessage },
			{ status: 500 }
		);
	}
}
