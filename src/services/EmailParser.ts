import { log } from '../utils/helpers';

export class EmailParser {
  static extractConfirmationLink(emailData: any): string | null {
    let bodyText = '';
    
    if (typeof emailData === 'string') {
      bodyText = emailData;
      log('Email body received as string');
    } 
    else if (emailData && typeof emailData === 'object') {
      log('Email body received as object. Properties: ' + Object.keys(emailData).join(', '));
      
      
      if (emailData.html) {
        bodyText = emailData.html;
        log('Using HTML email body');
      } else if (emailData.body) {
        
        bodyText = emailData.body;
        log('Using body property from temp-mail.solutions');
      } else if (emailData.htmlEmbedded) {
        
        bodyText = emailData.htmlEmbedded;
        log('Using htmlEmbedded property from temp-mail.solutions');
      } else if (emailData.text) {
        
        bodyText = emailData.text;
        log('Using text email body');
      } else if (emailData.content) {
        bodyText = emailData.content;
        log('Using content property');
      } else if (emailData.intro) {
        bodyText = emailData.intro;
        log('Using intro property');
      } else {
        
        for (const key in emailData) {
          const value = emailData[key];
          if (typeof value === 'string' && 
              (value.includes('http') || value.includes('href') || value.includes('<a'))) {
            bodyText = value;
            log(`Using property ${key} that appears to contain links`);
            break;
          }
        }
        
        if (!bodyText) {
          try {
            bodyText = JSON.stringify(emailData);
            log('Converting complete object to string');
          } catch (e) {
            const error = e instanceof Error ? e.message : 'Unknown error';
            log('Failed to convert object to string: ' + error, 'warn');
          }
        }
      }
    } else {
      log('Email body in unrecognized format: ' + typeof emailData, 'error');
      return null;
    }

    if (!bodyText) {
      log('Could not extract text from email body', 'error');
      return null;
    }
    
    if (typeof bodyText !== 'string') {
      try {
        bodyText = String(bodyText);
      } catch (e) {
        const error = e instanceof Error ? e.message : 'Unknown error';
        log('Failed to convert email body to string: ' + error, 'error');
        return null;
      }
    }
    
    
    const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
    const urls = bodyText.match(urlRegex) || [];
    
    log(`Found ${urls.length} URLs in email body`);
    
    
    const confirmationKeywords = ['confirm', 'verify', 'activate', 'validation', 'account'];
    
    
    for (const keyword of confirmationKeywords) {
      const confirmationUrls = urls.filter(url => url.toLowerCase().includes(keyword));
      if (confirmationUrls.length > 0 && confirmationUrls[0]) {
        log(`Confirmation URL found with keyword "${keyword}": ${confirmationUrls[0]}`, 'success');
        return confirmationUrls[0];
      }
    }
    
    
    if (urls.length > 0 && urls[0]) {
      const firstUrl = urls[0];
      log(`No specific confirmation URL found. Using first URL: ${firstUrl}`);
      return firstUrl;
    }
    
    log('No URLs found in email body', 'warn');
    return null;
  }
  
  static isConfirmationEmail(message: any): boolean {
    if (!message) {
      log('Message does not exist', 'warn');
      return false;
    }
    
    
    
    const subject = message.subject ? message.subject.toLowerCase() : '';
    const from = message.from ? message.from.toLowerCase() : '';
    
    
    const confirmationKeywords = [
      'confirm', 'verify', 'activate', 'welcome', 
      'registration', 'instruction', 'account', 
      'complete', 'setup', 'bolt'
    ];
    
    
    const isConfirmationSubject = confirmationKeywords.some(keyword => subject.includes(keyword));
    
    
    const isConfirmationSender = ['bolt', 'stackblitz', 'noreply', 'welcome', 'auth'].some(
      sender => from.includes(sender)
    );
    
    const isConfirmation = isConfirmationSubject || isConfirmationSender;
    
    
    const identifier = message.subject || message.h_mail || 'No identifier';
    log(`Checking email "${identifier}": ${isConfirmation ? 'Appears to be confirmation' : 'Does not appear to be confirmation'}`);
    
    return isConfirmation;
  }
}