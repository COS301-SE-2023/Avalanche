/* eslint-disable prettier/prettier */
// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmail(email: string, subject: string, text: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      // setup your email service here
    });

    await transporter.sendMail({
      from: '"No Reply" <no-reply@example.com>',
      to: email,
      subject: subject,
      text: text,
    });
  }
}
