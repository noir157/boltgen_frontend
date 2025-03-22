import axios from 'axios';
import { log } from '../utils/helpers';

interface AccountResponse {
  success: boolean;
  accountInfo?: {
    email: string;
    username: string;
    password: string;
    confirmed: boolean;
  };
  error?: string;
  diagnostic?: boolean;
}

interface CreateAccountOptions {
  username?: string;
  password?: string;
}

export class AccountManager {
  private baseUrl: string;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; 

  constructor() {
    
    const apiUrl = import.meta.env.VITE_API_URL || 'https://web-production-47450.up.railway.app';
    this.baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    console.log('API Base URL:', this.baseUrl);
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryWithBackoff(operation, retries - 1);
      }
      throw error;
    }
  }

  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  async checkServerStatus(): Promise<boolean> {
    try {
      log('Checking server status...');
      
      
      try {
        const response = await this.retryWithBackoff(() => 
          this.makeRequest(`${this.baseUrl}/api/status`)
        );
        const data = await response.json();
        if (data && data.status === 'online') {
          log('Server is online', 'success');
          return true;
        }
      } catch (error) {
        log('Main status check failed, trying fallback...', 'warn');
      }

      
      try {
        const response = await this.retryWithBackoff(() => 
          this.makeRequest(`${this.baseUrl}/api/healthcheck`)
        );
        const data = await response.json();
        if (data && data.status === 'ok') {
          log('Server is online (healthcheck)', 'success');
          return true;
        }
      } catch (error) {
        log('Healthcheck failed', 'error');
      }

      
      try {
        const response = await this.retryWithBackoff(() => 
          this.makeRequest(`${this.baseUrl}/ping`)
        );
        const data = await response.json();
        if (data && (data.status === 'ok' || data.ping === 'pong')) {
          log('Server is online (ping)', 'success');
          return true;
        }
      } catch (error) {
        log('All status checks failed', 'error');
      }

      return false;
    } catch (error) {
      log('Server status check failed completely', 'error');
      return false;
    }
  }

  async testCors(): Promise<boolean> {
    try {
      log('Testing CORS configuration...');
      const response = await this.retryWithBackoff(() => 
        this.makeRequest(`${this.baseUrl}/api/cors-test`)
      );
      const data = await response.json();
      const success = data && data.success === true;
      log(success ? 'CORS test passed' : 'CORS test failed', success ? 'success' : 'error');
      return success;
    } catch (error) {
      log('CORS test failed', 'error');
      return false;
    }
  }
  
  async createAndConfirmAccount(options: CreateAccountOptions = {}): Promise<AccountResponse> {
    try {
      log('Creating new account...');
      
      const response = await this.retryWithBackoff(() => 
        this.makeRequest(`${this.baseUrl}/api/create-account`, {
          method: 'POST',
          body: JSON.stringify({
            username: options.username,
            password: options.password
          })
        })
      );
      
      const data = await response.json();
      
      if (data.success && data.accountInfo) {
        log('Account created successfully', 'success');
        return data;
      } else {
        throw new Error(data.error || 'Failed to create account');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`Account creation failed: ${errorMessage}`, 'error');
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}