import { Request, Response, NextFunction } from "express";
import * as nodemailer from "nodemailer";

export default function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.DREAMER_CODES_GMAIL_USERNAME,
      pass: process.env.DREAMER_CODES_GMAIL_PASSWORD,
    },
  });

  request["mailTransporter"] = transporter;

  next();
}
