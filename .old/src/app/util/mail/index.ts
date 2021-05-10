import * as nodemailer from 'nodemailer';
import { ModuleResolutionKind } from 'typescript';
import Environment from './../../../environment';
import Logger from './../logger';
 
class GMailService { 
  private transporter: nodemailer.Transporter; 

  constructor() { 
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: Environment.MailUser,
        pass: Environment.MailPass,
      }
    });
  }

  sendMail(to: string, subject: string, content: string): Promise<void> { 
    const mail_options = { 
      from: Environment.MailUser, 
      to: to, 
      subject: subject, 
      text: content 
    } 

    return new Promise<void> ( 
      (resolve: (msg: any) => void,  
        reject: (err: Error) => void) => { 
          this.transporter.sendMail(  
            mail_options, (error, info) => { 
              if (error) { 
                Logger.error("GMailService sendMail error!", error);
                reject(error); 
              } else { 
                resolve(`GMailService sendMail result: ${info.response}`); 
              } 
          }) 
        } 
    );
  } 
} 

class Singleton {
  private static instance: GMailService;

  private constructor() {}
  
  public static getInstance(): GMailService {
    if (!Singleton.instance) {
      Singleton.instance = new GMailService()
    }        
    return Singleton.instance
  }
}

module.exports = Singleton.getInstance();