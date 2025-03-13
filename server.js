require("dotenv").config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Sajikan index.html langsung dari root folder
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Konfigurasi Nodemailer untuk Zoho Mail
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_EMAIL, // Email Zoho Anda
        pass: process.env.ZOHO_PASSWORD, // App Password dari Zoho
    },
});

// Endpoint untuk mengirim email
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    // **Email untuk user**
    const userMailOptions = {
        from: '"Weply Studio Support" <support@weplystudio.my.id>',
        to: email,
        subject: "Terima Kasih Telah Menghubungi Kami!",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Auto Reply</title>
          <style>
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
                  font-family: Arial, sans-serif;
              }
              .header {
                  font-size: 24px;
                  font-weight: bold;
                  color: #374151;
              }
              .content {
                  font-size: 16px;
                  color: #4b5563;
                  margin-top: 10px;
              }
              .footer {
                  font-size: 14px;
                  color: #9ca3af;
                  margin-top: 20px;
              }
              .btn {
                  display: inline-block;
                  background-color: #6366f1;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .btn:hover {
                  background-color: #4f46e5;
              }
              @media screen and (max-width: 600px) {
                  .container {
                      width: 90%;
                      padding: 15px;
                  }
                  .header {
                      font-size: 20px;
                  }
                  .content {
                      font-size: 14px;
                  }
                  .footer {
                      font-size: 12px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">Terima kasih telah menghubungi kami!</div>
              <div class="content">
                  <p>Halo ${name},</p>
                  <p>Kami telah menerima email Anda dan akan segera merespons dalam waktu 24 jam.</p>
                  <p>Jika pertanyaan Anda mendesak, silakan hubungi kami melalui <strong>telepon</strong> atau <strong>WhatsApp</strong>.</p>
                  <a href="https://weplystudio.my.id" class="btn">Kunjungi Website Kami</a>
              </div>
              <div class="footer">© 2025 Weply Studio | All rights reserved</div>
          </div>
      </body>
      </html>
    `,
    };

    // **Email untuk admin**
    const adminMailOptions = {
        from: '"Weply Studio Support" <support@weplystudio.my.id>',
        to: process.env.ADMIN_EMAIL, // Email admin yang menerima notifikasi
        subject: "🔔 Notifikasi: Pesan Baru dari Website",
        html: `
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Auto Reply</title>
    <style>
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #374151;
        }
        .content {
            font-size: 16px;
            color: #4b5563;
            margin-top: 10px;
        }
        .footer {
            font-size: 14px;
            color: #9ca3af;
            margin-top: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #6366f1;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #4f46e5;
        }
        @media screen and (max-width: 600px) {
            .container {
                width: 90%;
                padding: 15px;
            }
            .header {
                font-size: 20px;
            }
            .content {
                font-size: 14px;
            }
            .footer {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Ada pesan baru untuk anda!</div>
        <div class="content">
            <p>Halo,</p>
            <p>Ada pesan baru untuk anda!</p>
            <code>
               <div class="header"><strong>Informasi Pengirim</strong></div><br>
               Nama : ${name}<br>
               Email Pengirim : ${email}<br>
               Pesan : ${message}
            </code><br>
            <a href="https://weplystudio.my.id" class="btn">Kunjungi Website Kami</a>
        </div>
        <div class="footer">© 2025 Weply Studio | All right reserved</div>
    </div>
</body>
</html>
    `,
    };

    try {
        await transporter.sendMail(userMailOptions); // Kirim ke user
        await transporter.sendMail(adminMailOptions); // Kirim ke admin
        res.status(200).json({ success: true, message: "Berhasil dikirim!" });
    } catch (error) {
        console.error("❌ Error mengirim email:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengirim!",
            error,
        });
    }
});

// Jalankan server di port Replit atau 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
