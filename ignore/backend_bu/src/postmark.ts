var postmark = require('postmark'); 
// Send an email:
export const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

type emailProps = {
    from: string;
    to: string;
    subject: string;
    htmlbody: string;
    textbody: string;
    messageStream: 'outbound' | 'broadcast';
    replyTo?: string;
}


export const sendEmail = async (emailProps: emailProps) => {
    await client.sendEmail({
        From: emailProps.from,
        To: emailProps.to,
        Subject: emailProps.subject,
        TextBody: emailProps.textbody,
        HtmlBody: emailProps.htmlbody,
        MessageStream: emailProps.messageStream,
        ReplyTo: emailProps.replyTo,
        
    })
}