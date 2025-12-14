import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY!,
    process.env.MAILJET_API_SECRET!
);

type SendOptions = {
    toEmail: string;
    toName?: string;
    subject: string;
    html: string;
};

export async function sendMailjetEmail({
                                           toEmail,
                                           toName,
                                           subject,
                                           html,
                                       }: SendOptions) {
    const fromEmail = process.env.MAILJET_SENDER_EMAIL!;
    const fromName = process.env.MAILJET_SENDER_NAME || "Froggymouth";

    await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: {
                    Email: fromEmail,
                    Name: fromName,
                },
                To: [
                    {
                        Email: toEmail,
                        Name: toName ?? "",
                    },
                ],
                Subject: subject,
                HTMLPart: html,
            },
        ],
    });
}
