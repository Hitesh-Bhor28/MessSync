export const sendOtpEmail = async (toEmail: string, otpCode: string) => {
  const url = 'https://api.brevo.com/v3/smtp/email';
  const apiKey = process.env.BREVO_API_KEY || '';

  const payload = {
    sender: {
      name: "MessSync Support",
      email: process.env.BREVO_SENDER_EMAIL || "messsync@noreply.com"
    },
    to: [
      {
        email: toEmail,
        name: "Student"
      }
    ],
    subject: "Your MessSync Verification Code",
    textContent: `Your verification code is ${otpCode}. It expires in 5 minutes.`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16A34A;">MessSync Verification</h2>
        <p>Hello,</p>
        <p>Please use the following 4-digit code to complete your signup process. This code will expire in 5 minutes.</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <h1 style="color: #111827; letter-spacing: 4px; margin: 0;">${otpCode}</h1>
        </div>
        <p>If you did not request this code, please ignore this email.</p>
        <br />
        <p>Best regards,<br/>The MessSync Team</p>
      </div>
    `
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send OTP via Brevo");
    }

    const data = await response.json();
    console.log("Brevo message sent:", data.messageId);
    return { success: true, data };
  } catch (err: any) {
    console.error("Brevo Send Error:", err.message);
    throw new Error(err.message || "Failed to send OTP email");
  }
};
