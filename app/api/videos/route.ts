import { authOptions } from '@/lib/auth';
import { dbConnect } from '@/lib/db';
import Video, { VideoInterface } from '@/models/Video';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all videos in descending order
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      // Return an empty array
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch videos!' },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if the user is logged in or not
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'User not authorized!' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body: VideoInterface = await req.json();

    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: 'Missing required fields!' },
        { status: 400 }
      );
    }

    // Create new video object
    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    // Insert newVideo into the database
    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create video!' },
      { status: 200 }
    );
  }
}
