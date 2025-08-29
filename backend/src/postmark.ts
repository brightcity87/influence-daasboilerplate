const postmark = require('postmark');

// Use mailpit for development, postmark for production
export const client = process.env.NODE_ENV === 'development'
    ? {
        // Start of Selection
        sendEmail: async (options) => {
            const nodemailer = require('nodemailer');

            const transporter = nodemailer.createTransport({
                // expect mailpit to be running on the same host as the backend
                host: `${process.env.PROJECT_SLUG}_mailpit`,
                port: 1025,
                secure: false, // Use TLS
            });

            try {
                const mailOptions = {
                    from: options.From,
                    to: options.To,
                    subject: options.Subject,
                    text: options.TextBody,
                    html: options.HtmlBody,
                    cc: options.Cc,
                    attachments: options.Attachments?.map(att => ({
                        filename: att.Name,
                        content: att.Content,
                        contentType: att.ContentType
                    }))
                };

                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent:', info.messageId);
                return { messageId: info.messageId };
            } catch (error) {
                console.error('Error sending email:', error);
                return {
                    error: true,
                    message: error.message
                };
            }
        }
    }
    : new postmark.ServerClient(process.env.POSTMARK_API_KEY);
// Send an email:
// export const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

type emailProps = {
    from: string;
    to: string;
    subject: string;
    htmlbody: string;
    textbody: string;
    messageStream: 'outbound' | 'broadcast';
    replyTo?: string;
    cc?: string;
}

type emailAttachmentProps = emailProps & {
    attachment: {
        ContentType: string;
        Filename: string;
        Content: string;
    }
}

export const sendEmail = async (emailProps: emailProps) => {
    await client.sendEmail({
        From: emailProps.from,
        To: emailProps.to,
        Cc: emailProps.cc,
        Subject: emailProps.subject,
        TextBody: emailProps.textbody,
        HtmlBody: emailProps.htmlbody,
        MessageStream: emailProps.messageStream,
        ReplyTo: emailProps.replyTo,
    }).catch((err) => {
        console.error(err);
        return {
            error: true,
            message: err.message
        }
    })
}
export const sendMailAttachment = async (emailProps: emailAttachmentProps) => {
    const attachment = new postmark.Models.Attachment(
        emailProps.attachment.Filename,
        emailProps.attachment.Content,
        emailProps.attachment.ContentType,
    );
    return await client.sendEmail({
        From: emailProps.from,
        To: emailProps.to,
        Cc: emailProps.cc,
        Subject: emailProps.subject,
        TextBody: emailProps.textbody,
        HtmlBody: emailProps.htmlbody,
        MessageStream: emailProps.messageStream,
        ReplyTo: emailProps.replyTo,
        Attachments: [attachment]
    }).catch((err) => {
        console.error(err);
        return {
            error: true,
            message: err.message
        }
    })
}