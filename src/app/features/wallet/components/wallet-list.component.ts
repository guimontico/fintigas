import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WalletStore } from '../../../store/wallet.store';

@Component({
  selector: 'app-wallet-list',
  imports: [],
  template: `
    <div class="p-8 bg-white rounded shadow">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-900">My Wallet</h2>
        @if (!walletStore.isEmpty()) {
          <div class="text-sm text-gray-600">
            {{ walletStore.tickersCount() }} ticker{{ walletStore.tickersCount() === 1 ? '' : 's' }}
          </div>
        }
      </div>

      @if (walletStore.isEmpty()) {
        <div class="py-12 text-center text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Your wallet is empty</h3>
          <p class="mt-2 text-sm text-gray-500">Search for stocks and save them to your wallet.</p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (ticker of walletStore.tickers(); track ticker.symbol) {
            <div class="p-4 border border-gray-200 rounded bg-gray-50">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="font-semibold text-gray-900 text-lg mb-1">{{ ticker.symbol }}</div>
                  <div class="text-gray-700 text-sm mb-2">{{ ticker.name }}</div>
                  <div class="flex gap-4 text-sm text-gray-600 mb-2">
                    <span>{{ ticker.type }}</span>
                    <span>{{ ticker.region }}</span>
                    <span>{{ ticker.currency }}</span>
                  </div>
                  @if (ticker.notes) {
                    <div class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700">
                      {{ ticker.notes }}
                    </div>
                  }
                  <div class="mt-2 text-xs text-gray-500">
                    Saved {{ formatDate(ticker.savedAt) }}
                  </div>
                </div>
                <div class="ml-4 flex flex-col gap-2">
                  <button
                    (click)="removeTicker(ticker.symbol)"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            (click)="exportWallet()"
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm font-medium"
            type="button"
          >
            Export
          </button>
          <button
            (click)="clearWallet()"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
            type="button"
          >
            Clear All
          </button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletListComponent {
  walletStore = inject(WalletStore);

  removeTicker(symbol: string): void {
    if (confirm(`Remove ${symbol} from your wallet?`)) {
      this.walletStore.removeTicker(symbol);
    }
  }

  clearWallet(): void {
    if (confirm('Are you sure you want to clear all tickers from your wallet? This action cannot be undone.')) {
      this.walletStore.clearWallet();
    }
  }

  exportWallet(): void {
    const data = this.walletStore.exportWallet();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fintigas-wallet-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString();
  }
}
