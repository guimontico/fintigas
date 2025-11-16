import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { WalletStore } from '../../store/wallet.store';
import { WalletListComponent } from './components/wallet-list.component';

@Component({
  selector: 'app-wallet',
  imports: [WalletListComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <app-wallet-list />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPage implements OnInit {
  walletStore = inject(WalletStore);

  ngOnInit(): void {
    // Load wallet from localStorage on initialization
    this.walletStore.loadFromStorage();
  }
}
