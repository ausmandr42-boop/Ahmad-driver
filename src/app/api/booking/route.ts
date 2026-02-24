import { NextResponse } from "next/server";
import { Resend } from "resend";

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  message: string;
}

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

// Your email where you receive bookings
const OWNER_EMAIL = "ausmandr42@gmail.com";

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.phone || !body.pickup || !body.dropoff || !body.date || !body.time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format date and time for display
    const formattedDate = new Date(body.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send email notification
    let emailSent = false;
    let emailError = null;
    
    try {
      const response = await resend.emails.send({
        from: "Ahmad: Your Chicago Driver <onboarding@resend.dev>",
        to: OWNER_EMAIL,
        subject: `🚗 New Booking Request from ${body.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #d97706; margin-bottom: 20px;">🚗 New Booking Request!</h1>
              
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 18px; font-weight: bold;">${body.name}</p>
                <p style="margin: 5px 0 0 0; color: #666;">${body.phone}</p>
                ${body.email ? `<p style="margin: 5px 0 0 0; color: #666;">${body.email}</p>` : ''}
              </div>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>📅 Date:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>⏰ Time:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${body.time}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>📍 Pickup:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${body.pickup}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>🎯 Drop-off:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${body.dropoff}</td>
                </tr>
                ${body.message ? `
                <tr>
                  <td style="padding: 10px 0;"><strong>📝 Notes:</strong></td>
                  <td style="padding: 10px 0;">${body.message}</td>
                </tr>
                ` : ''}
              </table>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #d97706;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>Reply to customer:</strong> 
                  <a href="sms:${body.phone}" style="color: #d97706;">Text ${body.phone}</a>
                </p>
              </div>
            </div>
            
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
              Sent from Ahmad: Your Chicago Driver Website
            </p>
          </div>
        `,
      });
      
      console.log("Email sent successfully:", response);
      emailSent = true;
    } catch (emailError) {
      console.error("Email error:", emailError);
      emailError = emailError;
    }

    // Log the booking
    console.log("New booking request:", {
      ...body,
      timestamp: new Date().toISOString(),
      emailSent,
      emailError
    });

    return NextResponse.json({
      success: true,
      message: "Booking request received successfully",
      emailSent,
      emailError: emailError ? String(emailError) : null,
      booking: {
        id: `BK${Date.now()}`,
        ...body,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to process booking request" },
      { status: 500 }
    );
  }
}
