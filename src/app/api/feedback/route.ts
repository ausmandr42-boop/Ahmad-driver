import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";

interface FeedbackRequest {
  name: string;
  rating: number;
  text: string;
}

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Your email where you receive feedback
const OWNER_EMAIL = "ausmandr42@gmail.com";

// GET - Fetch published reviews
export async function GET() {
  try {
    const reviews = await db.review.findMany({
      where: { published: true },
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

// POST - Submit new feedback
export async function POST(request: Request) {
  try {
    const body: FeedbackRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.rating || !body.text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Save to database
    const review = await db.review.create({
      data: {
        name: body.name,
        rating: body.rating,
        text: body.text,
        date: "Just now",
        published: false,
      },
    });

    // Send email notification
    let emailSent = false;
    
    try {
      const stars = "⭐".repeat(body.rating);
      
      await resend.emails.send({
        from: "Ahmad: Your Chicago Driver <onboarding@resend.dev>",
        to: OWNER_EMAIL,
        subject: `⭐ New Review from ${body.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #d97706; margin-bottom: 20px;">⭐ New Review Received!</h1>
              
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 18px; font-weight: bold;">${body.name}</p>
                <p style="margin: 5px 0 0 0; font-size: 24px;">${stars}</p>
              </div>

              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 16px; line-height: 1.6;">"${body.text}"</p>
              </div>

              <div style="margin-top: 30px; padding: 20px; background-color: #e0f2fe; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #0369a1;">📋 Action Required:</p>
                <p style="margin: 0; color: #666;">
                  Visit the admin dashboard to approve and publish this review to your website.
                </p>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
                  Review ID: ${review.id}
                </p>
              </div>
            </div>
            
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
              Sent from Ahmad: Your Chicago Driver Website
            </p>
          </div>
        `,
      });
      
      emailSent = true;
      console.log("Feedback email sent successfully");
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    console.log("New feedback received:", {
      id: review.id,
      name: body.name,
      rating: body.rating,
      text: body.text,
      emailSent,
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      emailSent,
      review: {
        id: review.id,
        name: review.name,
        rating: review.rating,
        text: review.text,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
