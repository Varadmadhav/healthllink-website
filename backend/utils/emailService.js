require("dotenv").config()
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

exports.sendConfirmationEmail = async ({
  toEmail,
  employeeName,
  companyName,
  centerName,
  centerAddress,
  appointmentDate,
  loginId,
  tempPassword,
  isExistingUser,
  isReschedule = false,
  rescheduleApproved = false,
}) => {

  if (isReschedule) {
    const subject = rescheduleApproved
      ? `✅ Reschedule Approved — ${companyName} Health Checkup`
      : `❌ Reschedule Rejected — ${companyName} Health Checkup`

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
                  border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);
                    padding:24px;color:white;">
          <h2 style="margin:0;">
            ${rescheduleApproved ? "✅ Reschedule Approved" : "❌ Reschedule Rejected"}
          </h2>
          <p style="margin:6px 0 0;opacity:0.9;">${companyName} — Health Checkup Program</p>
        </div>
        <div style="padding:24px;">
          <p>Dear <strong>${employeeName}</strong>,</p>
          ${rescheduleApproved
            ? `<p>Your reschedule request has been <strong>approved</strong>.
                Your updated appointment details are below.</p>`
            : `<p>Your reschedule request has been <strong>rejected</strong>.
                Your original appointment date remains unchanged.</p>`
          }
          <div style="background:#f7fafc;border-left:4px solid #667eea;
                      padding:16px;margin:16px 0;border-radius:4px;">
            <h3 style="margin:0 0 12px;color:#4a5568;">📅 Appointment Details</h3>
            <p style="margin:5px 0;"><strong>Center Name:</strong> ${centerName}</p>
            <p style="margin:5px 0;"><strong>Center Address:</strong> ${centerAddress}</p>
            <p style="margin:5px 0;"><strong>Appointment Date:</strong> ${appointmentDate}</p>
          </div>
          <p style="margin:12px 0 0;">
            <a href="http://127.0.0.1:5501/Healthlink/Solutions/corp_sol/corp_solsignup.html"
               style="background:#667eea;color:white;padding:10px 20px;
                      border-radius:4px;text-decoration:none;font-size:14px;">
              View Dashboard →
            </a>
          </p>
        </div>
        <div style="background:#f7fafc;padding:12px 24px;
                    font-size:12px;color:#a0aec0;text-align:center;">
          This is an automated email — please do not reply.
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"Health Checkup System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      html,
    })
    return
  }

  const loginSection = isExistingUser
    ? `
      <p>You already have a login account. Please use your <strong>existing password</strong> to sign in.</p>
      <p><strong>Login Email:</strong> ${loginId}</p>
    `
    : `
      <p>A login account has been created for you:</p>
      <table style="border-collapse:collapse;margin:8px 0;">
        <tr>
          <td style="padding:4px 16px 4px 0;"><strong>Login Email:</strong></td>
          <td>${loginId}</td>
        </tr>
        <tr>
          <td style="padding:4px 16px 4px 0;"><strong>Temporary Password:</strong></td>
          <td style="font-family:monospace;font-size:15px;letter-spacing:1px;">${tempPassword}</td>
        </tr>
      </table>
      <p style="color:#c53030;font-size:13px;">
        ⚠️ Please change your password after your first login.
      </p>
    `

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
                border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#667eea,#764ba2);
                  padding:24px;color:white;">
        <h2 style="margin:0;">✅ Appointment Confirmed</h2>
        <p style="margin:6px 0 0;opacity:0.9;">${companyName} — Health Checkup Program</p>
      </div>
      <div style="padding:24px;">
        <p>Dear <strong>${employeeName}</strong>,</p>
        <p>Your health checkup appointment has been confirmed by the admin.
           Please find your appointment and login details below.</p>
        <div style="background:#f7fafc;border-left:4px solid #667eea;
                    padding:16px;margin:16px 0;border-radius:4px;">
          <h3 style="margin:0 0 12px;color:#4a5568;">📅 Appointment Details</h3>
          <p style="margin:5px 0;"><strong>Center Name:</strong> ${centerName}</p>
          <p style="margin:5px 0;"><strong>Center Address:</strong> ${centerAddress}</p>
          <p style="margin:5px 0;"><strong>Appointment Date:</strong> ${appointmentDate}</p>
        </div>
        <div style="background:#f0fff4;border-left:4px solid #38a169;
                    padding:16px;margin:16px 0;border-radius:4px;">
          <h3 style="margin:0 0 12px;color:#276749;">🔐 Your Login Details</h3>
          ${loginSection}
          <p style="margin:12px 0 0;">
            <a href="http://127.0.0.1:5501/Healthlink/Solutions/corp_sol/corp_solsignup.html"
               style="background:#667eea;color:white;padding:10px 20px;
                      border-radius:4px;text-decoration:none;font-size:14px;">
              Login to Dashboard →
            </a>
          </p>
        </div>
        <p style="color:#718096;font-size:13px;margin-top:20px;">
          Please carry a valid ID proof on the day of your appointment.<br>
          For any queries, contact your HR or company admin.
        </p>
      </div>
      <div style="background:#f7fafc;padding:12px 24px;
                  font-size:12px;color:#a0aec0;text-align:center;">
        This is an automated email — please do not reply.
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Health Checkup System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ Appointment Confirmed — ${companyName} Health Checkup`,
    html,
  })
}

// ── Date Change Notification
// Sent to: employee when admin approves/rejects, HR when employee makes a request
// action: "requested" | "approved" | "rejected"
// requestedBy: "hr" | "employee"
exports.sendDateChangeNotification = async ({
  toEmail,
  recipientName,
  employeeName,
  currentDate,
  requestedDate,
  action,
  requestedBy
}) => {
  const formattedCurrent = currentDate
    ? new Date(currentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "-"
  const formattedRequested = requestedDate
    ? new Date(requestedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "-"

  let subject, headerColor, headerTitle, bodyText

  if (action === "requested") {
    subject = `📅 Date Change Request — ${employeeName}`
    headerColor = "#f59e0b"
    headerTitle = "📅 Date Change Requested"
    bodyText = `
      <p><strong>${employeeName}</strong> has submitted a date change request.</p>
      <p>Please review it in the admin panel.</p>
    `
  } else if (action === "approved") {
    subject = `✅ Date Change Approved — Your Appointment`
    headerColor = "#10b981"
    headerTitle = "✅ Date Change Approved"
    bodyText = `
      <p>Your date change request has been <strong>approved</strong> by the admin.</p>
      <p>Your appointment date has been updated.</p>
    `
  } else {
    subject = `❌ Date Change Rejected — Your Appointment`
    headerColor = "#ef4444"
    headerTitle = "❌ Date Change Rejected"
    bodyText = `
      <p>Your date change request has been <strong>rejected</strong> by the admin.</p>
      <p>Your original appointment date remains unchanged.</p>
    `
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
                border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:${headerColor};padding:24px;color:white;">
        <h2 style="margin:0;">${headerTitle}</h2>
        <p style="margin:6px 0 0;opacity:0.9;">HealthLink Health Checkup Program</p>
      </div>
      <div style="padding:24px;">
        <p>Dear <strong>${recipientName}</strong>,</p>
        ${bodyText}
        <div style="background:#f7fafc;border-left:4px solid ${headerColor};
                    padding:16px;margin:16px 0;border-radius:4px;">
          <h3 style="margin:0 0 12px;color:#4a5568;">📅 Date Details</h3>
          <p style="margin:5px 0;"><strong>Employee:</strong> ${employeeName}</p>
          <p style="margin:5px 0;"><strong>Current Date:</strong> ${formattedCurrent}</p>
          <p style="margin:5px 0;"><strong>Requested Date:</strong> ${formattedRequested}</p>
        </div>
        <p style="margin:12px 0 0;">
          <a href="http://127.0.0.1:5501/Healthlink/Solutions/corp_sol/corp_solsignup.html"
             style="background:#667eea;color:white;padding:10px 20px;
                    border-radius:4px;text-decoration:none;font-size:14px;">
            View Dashboard →
          </a>
        </p>
      </div>
      <div style="background:#f7fafc;padding:12px 24px;
                  font-size:12px;color:#a0aec0;text-align:center;">
        This is an automated email — please do not reply.
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Health Checkup System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
  })
}

exports.sendPasswordResetEmail = async ({ toEmail, userName, resetToken, role }) => {
  const resetUrl = `http://127.0.0.1:5501/Healthlink/Solutions/corp_sol/reset_password.html?token=${resetToken}&role=${role}`

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;
                border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#667eea,#764ba2);
                  padding:24px;color:white;">
        <h2 style="margin:0;">🔐 Password Reset Request</h2>
        <p style="margin:6px 0 0;opacity:0.9;">HealthLink System</p>
      </div>
      <div style="padding:24px;">
        <p>Dear <strong>${userName}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <p style="margin:24px 0;">
          <a href="${resetUrl}"
             style="background:#667eea;color:white;padding:12px 24px;
                    border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;">
            Reset My Password →
          </a>
        </p>
        <p style="color:#718096;font-size:13px;">
          This link expires in <strong>1 hour</strong>.<br>
          If you did not request this, ignore this email — your password will not change.
        </p>
      </div>
      <div style="background:#f7fafc;padding:12px 24px;
                  font-size:12px;color:#a0aec0;text-align:center;">
        This is an automated email — please do not reply.
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Health Checkup System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🔐 Password Reset — HealthLink System",
    html,
  })
}