 const emailTemplate = (otp) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
      }
      .header {
        background-color:rgb(211, 119, 176);
        color: #ffffff;
        padding: 10px;
        text-align: center;
        border-radius: 10px 10px 0 0;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 10px;
        text-align: center;
        color: #777;
        border-radius: 0 0 10px 10px;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
      }
      .btn:hover {
        background-color: #0056b3;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Forgot Request</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>You recently requested to forgot your password. Below is your OTP:</p>
        <p><strong>OTP: ${otp}</strong></p>
        <p>If you did not request a password forgot, please ignore this email.</p>
        <p>Thank you!</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Shaziya Shaikh, Inc. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;
module.exports = emailTemplate;