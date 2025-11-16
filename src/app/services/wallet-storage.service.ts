import { Injectable } from '@angular/core';
import type { Wallet } from '../models';
import { createEmptyWallet } from '../models';

/**
 * Service for persisting wallet data to localStorage
 * Abstraction allows future migration to backend API
 */
@Injectable({
  providedIn: 'root',
})
export class WalletStorageService {
  private readonly STORAGE_KEY = 'fintigas_wallet';

  /**
   * Check if localStorage is available (SSR-safe)
   */
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Load wallet from localStorage
   */
  load(): Wallet {
    if (!this.isLocalStorageAvailable()) {
      return createEmptyWallet();
    }

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return createEmptyWallet();
      }

      const wallet = JSON.parse(data) as Wallet;
      return wallet;
    } catch (error) {
      console.error('Failed to load wallet from localStorage:', error);
      return createEmptyWallet();
    }
  }

  /**
   * Save wallet to localStorage
   */
  save(wallet: Wallet): boolean {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage not available, cannot save wallet');
      return false;
    }

    try {
      wallet.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wallet));
      return true;
    } catch (error) {
      console.error('Failed to save wallet to localStorage:', error);
      return false;
    }
  }

  /**
   * Clear wallet from localStorage
   */
  clear(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear wallet from localStorage:', error);
      return false;
    }
  }

  /**
   * Export wallet as JSON string
   */
  export(): string | null {
    const wallet = this.load();
    try {
      return JSON.stringify(wallet, null, 2);
    } catch (error) {
      console.error('Failed to export wallet:', error);
      return null;
    }
  }

  /**
   * Import wallet from JSON string
   */
  import(jsonData: string): boolean {
    try {
      const wallet = JSON.parse(jsonData) as Wallet;
      
      // Basic validation
      if (!wallet.tickers || !Array.isArray(wallet.tickers)) {
        throw new Error('Invalid wallet format');
      }

      return this.save(wallet);
    } catch (error) {
      console.error('Failed to import wallet:', error);
      return false;
    }
  }
}
