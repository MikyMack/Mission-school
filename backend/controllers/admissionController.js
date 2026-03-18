const AdmissionEnquiry = require("../models/AdmissionEnquiry");
const { sendMail } = require("../utils/mailService");

exports.submitEnquiry = async (req, res) => {
  try {
    let { name, email, number, student, grade, message } = req.body;

    name = name?.trim();
    email = email?.trim();
    number = number?.trim();
    student = student?.trim();
    grade = grade?.trim();
    message = message?.trim();

    if (!name || !email || !number) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

    if (!phoneRegex.test(number)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }
    if (!phoneRegex.test(number)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    const enquiry = new AdmissionEnquiry({
      parentName: name,
      email,
      phone: number,
      studentName: student,
      grade,
      message,
    });

    await enquiry.save();

    /* ---------------- EMAIL TO ADMIN ---------------- */

    const adminHtml = `
<div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:20px;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">

    <div style="background:#0047ab;color:#ffffff;padding:15px;text-align:center">
      <h2 style="margin:0;">New Admission Enquiry</h2>
      <p style="margin:5px 0 0;">The Mission School</p>
    </div>

    <div style="padding:20px">
      <p>A new admission enquiry has been submitted from the website.</p>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Parent Name</strong></td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Email</strong></td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${email}</td>
        </tr>
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Phone</strong></td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${number}</td>
        </tr>
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Student</strong></td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${student || "-"}</td>
        </tr>
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Grade</strong></td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${grade || "-"}</td>
        </tr>
        <tr>
          <td style="padding:8px;"><strong>Message</strong></td>
          <td style="padding:8px;">${message || "-"}</td>
        </tr>
      </table>

      <p style="margin-top:20px;">Please contact the parent as soon as possible.</p>
    </div>

    <div style="background:#f1f1f1;padding:15px;text-align:center;font-size:13px">
      The Mission School | missionschool.edu@gmail.com
    </div>

  </div>
</div>
`;

    /* ---------------- EMAIL TO USER ---------------- */
    const userHtml = `
<div style="font-family: Arial, sans-serif;background:#f4f6f9;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">

    <div style="background:#0047ab;color:white;padding:20px;text-align:center">
      <h2 style="margin:0;">The Mission School</h2>
      <p style="margin:5px 0 0;">Admission Enquiry Received</p>
    </div>

    <div style="padding:20px">

      <p>Dear <strong>${name}</strong>,</p>

      <p>
        Thank you for your interest in <strong>Mission School</strong>.
        We have successfully received your admission enquiry.
      </p>

      <p>Our admission team will contact you shortly.</p>

      <h3 style="margin-top:25px;">Submitted Details</h3>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Student Name</strong></td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${student || "-"}</td>
        </tr>
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;"><strong>Grade</strong></td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${grade || "-"}</td>
        </tr>
      </table>

      <p style="margin-top:20px;">
        If you have any questions, please feel free to contact us.
      </p>

      <p>
        Regards,<br>
        <strong>The Mission School Admissions Team</strong>
      </p>

    </div>

    <div style="background:#f1f1f1;padding:15px;text-align:center;font-size:13px">
      The Mission School <br>
      Phone: +91 89047 88233 <br>
    </div>

  </div>
</div>
`;
    try {
      await sendMail(
        email,
        "New Admission Enquiry",
        adminHtml,
      );

      await sendMail(email, "Admission Enquiry Received", userHtml);
    } catch (mailError) {
      console.error("Mail sending error:", mailError);

      // Email failure should NOT break the enquiry submission
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry submitted successfully",
    });
  } catch (error) {
    console.log("Admission enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
