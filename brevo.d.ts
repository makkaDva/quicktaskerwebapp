declare module '@getbrevo/brevo' {
    export interface SendSmtpEmail {
      sender?: { email: string; name?: string };
      to?: Array<{ email: string }>;
      subject?: string;
      htmlContent?: string;
    }
  
    export class TransactionalEmailsApi {
      setApiKey(apiKeyIndex: number, apiKey: string): void;
      sendTransacEmail(sendSmtpEmail: SendSmtpEmail): Promise<any>;
    }
  
    const Brevo: {
      TransactionalEmailsApi: typeof TransactionalEmailsApi;
      SendSmtpEmail: typeof SendSmtpEmail;
    };
  
    export default Brevo;
  }