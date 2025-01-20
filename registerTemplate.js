const registerTemplate = (fullName) => `
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
        background-color: rgb(211, 119, 176);
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
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to ShazzyTech!</h1>
      </div>
      <div class="content">
        <p>Hello ${fullName},</p>
        <p>Thank you for registering with us! We're excited to have you on board.</p>
        <p>If you did not initiate this registration, please contact us immediately.</p>
        <p>Thank you!</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Shaziya Shaikh, Inc. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

module.exports= registerTemplate;