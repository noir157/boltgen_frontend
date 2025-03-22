import axios from 'axios';
import { log, delay } from '../utils/helpers';

export class TempEmailService {
  private baseUrl: string;
  private account: { email: string; password: string } | null;
  private token: string | null;

  constructor() {
    this.baseUrl = 'https://api.temp-mail.solutions';
    this.account = null;
    this.token = null;
  }

  async createAccount() {
    try {
      
      log('Requesting random email generation...');
      try {
        const response = await axios.get(`${this.baseUrl}/api/email`);
        
        if (response.data && response.data.data) {
          const data = response.data.data;
          
          this.token = data.token;
          this.account = { 
            email: data.email, 
            password: data.password 
          };
          
          log(`Temporary email created: ${this.account.email}`, 'success');
          return this.account;
        }
      } catch (directError) {
        const errorMsg = directError instanceof Error ? directError.message : 'Unknown error';
        log(`Direct email generation failed: ${errorMsg}. Trying alternative method...`, 'warn');
      }

      
      log('Obtaining available domains...');
      const domainsResponse = await axios.get(`${this.baseUrl}/api/domain`);
      
      if (!domainsResponse.data || !domainsResponse.data.data || !domainsResponse.data.data.length) {
        throw new Error('No domains returned by API');
      }
      
      
      const domains = domainsResponse.data.data;
      const activeDomains = domains.filter((domain: any) => domain.active);
      
      if (activeDomains.length === 0) {
        throw new Error('No active domains found');
      }
      
      const domain = activeDomains[0].domain;
      
      
      const username = `user${Math.floor(Math.random() * 100000)}${Date.now().toString().slice(-4)}`;
      const password = `pass${Math.random().toString(36).substring(2, 10)}`;
      const email = `${username}@${domain}`;

      log(`Creating account with email: ${email}`);
      
      
      await axios.post(`${this.baseUrl}/api/register`, {
        username: username,
        domain: domain,
        password: password
      });

      log('Getting access token...');
      
      const loginResponse = await axios.post(`${this.baseUrl}/api/login`, {
        email: email,
        password: password
      });
      
      if (!loginResponse.data || !loginResponse.data.data || !loginResponse.data.data.access_token) {
        throw new Error('Access token not returned by API');
      }
      
      this.token = loginResponse.data.data.access_token;
      this.account = { email, password };

      log(`Temporary email created (alternative method): ${email}`, 'success');
      return this.account;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log('Error creating temporary email: ' + errorMessage, 'error');
      throw new Error(`Failed to create temporary email: ${errorMessage}`);
    }
  }

  async checkInbox(maxAttempts = 30, delaySeconds = 5) {
    if (!this.token) {
      throw new Error('Account must be created before checking inbox');
    }

    log(`Checking emails for ${this.account?.email}...`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      log(`Attempt ${attempt}/${maxAttempts} to check emails...`);

      try {
        const response = await axios.get(`${this.baseUrl}/api/mail`, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        
        if (!response.data || !response.data.data) {
          log('API response without expected data structure', 'warn');
          await delay(delaySeconds * 1000);
          continue;
        }
        
        const messages = response.data.data;

        if (messages && messages.length > 0) {
          log(`${messages.length} email(s) found!`, 'success');
          return messages;
        }

        await delay(delaySeconds * 1000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log('Error checking emails: ' + errorMessage, 'warn');
        await delay(delaySeconds * 1000);
      }
    }

    log('Timeout exceeded. No emails received.', 'error');
    return [];
  }

  async getMessageDetails(messageId: string) {
    if (!this.token) {
      throw new Error('Account must be created before reading messages');
    }

    try {
      log(`Getting message details ${messageId}...`);
      const response = await axios.get(`${this.baseUrl}/api/mail/${messageId}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      
      if (!response.data || !response.data.data) {
        throw new Error('Message data not found in response');
      }
      
      const messageData = response.data.data;

      log('Email response structure:');
      log(`- Has HTML: ${Boolean(messageData.html)}`);
      log(`- Has body text: ${Boolean(messageData.body)}`);
      log(`- Has embedded HTML: ${Boolean(messageData.htmlEmbedded)}`);

      return messageData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`Error getting message details ${messageId}: ${errorMessage}`, 'error');
      throw error;
    }
  }

  
  async deleteMessage(messageId: string): Promise<boolean> {
    if (!this.token) {
      throw new Error('Account must be created before deleting messages');
    }

    try {
      log(`Deleting message ${messageId}...`);
      await axios.delete(`${this.baseUrl}/api/mail/${messageId}`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      
      log(`Message ${messageId} deleted successfully`, 'success');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`Error deleting message ${messageId}: ${errorMessage}`, 'error');
      return false;
    }
  }

  
  async deleteAccount(): Promise<boolean> {
    if (!this.token || !this.account) {
      log('No account to delete', 'warn');
      return false;
    }

    try {
      log(`Deleting account ${this.account.email}...`);
      await axios.delete(`${this.baseUrl}/api/email`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      
      log('Account deleted successfully', 'success');
      this.account = null;
      this.token = null;
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`Error deleting account: ${errorMessage}`, 'warn');
      return false;
    }
  }
}