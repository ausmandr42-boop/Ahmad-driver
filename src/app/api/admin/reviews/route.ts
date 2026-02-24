import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all reviews (including unpublished) for admin
export async function GET() {
  try {
    const reviews = await db.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// PUT - Toggle publish status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, published } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const review = await db.review.update({
      where: { id },
      data: { published },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a review
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    await db.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
