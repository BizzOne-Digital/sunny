import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import slugify from "slugify";
import { getAdminSession } from "@/lib/auth";
import { connectMongo, ImageAsset, Models } from "@/lib/site";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await connectMongo())) return NextResponse.json({ error: "MONGODB_URI is required." }, { status: 500 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }

  try {
    console.log('Starting file upload for:', file.name);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const slugifiedName = slugify(file.name.replace(`.${fileExtension}`, ''), { 
      lower: true, 
      strict: true 
    });
    const filename = `${slugifiedName}-${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    console.log('File saved to:', filepath);

    // Get image dimensions (basic estimation)
    const width = 1400; // Default width
    const height = 1000; // Default height

    const title = String(form.get("title") ?? file.name);
    const asset: ImageAsset = {
      id: `${slugifiedName}-${timestamp}`,
      title,
      alt: String(form.get("alt") ?? title),
      caption: String(form.get("caption") ?? ""),
      url: `/uploads/${filename}`,
      width,
      height,
      fileSize: file.size,
      page: String(form.get("page") ?? ""),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: "published",
      focalPoint: {
        x: Number(form.get("focalX") ?? 50),
        y: Number(form.get("focalY") ?? 50),
      },
    };

    console.log('Saving asset to MongoDB...');
    await Models.MediaAsset().updateOne({ id: asset.id }, { $set: asset }, { upsert: true });
    console.log('Asset saved successfully');

    return NextResponse.json({ 
      asset,
      message: "File uploaded successfully to /uploads folder",
      storage: "local"
    });
  } catch (error) {
    console.error('Upload error details:', error);
    const errorMessage = error instanceof Error ? error.message : "Upload failed.";
    console.error('Error message:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
