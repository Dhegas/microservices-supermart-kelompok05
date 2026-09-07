import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart, CartItem, Order } from '../models/types';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private notify = inject(NotificationService);
  private auth = inject(AuthService);

  cart = signal<Cart | null>(null);

  itemCount = computed(() => {
    const items = this.cart()?.items || [];
    return items.reduce((sum, item) => sum + item.quantity, 0);
  });

  totalAmount = computed(() => {
    const items = this.cart()?.items || [];
    return items.reduce((sum, item) => sum + (item.quantity * item.product_price), 0);
  });

  constructor() {
    if (this.auth.isLoggedIn()) {
      this.loadCart().subscribe();
    }
  }

  loadCart(): Observable<APIResponse<Cart>> {
    return this.http.get<APIResponse<Cart>>('/api/v1/orders/cart').pipe(
      tap(res => {
        if (res.success) {
          this.cart.set(res.data);
        }
      })
    );
  }

  addToCart(productId: string, quantity: number = 1): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>('/api/v1/orders/cart', { product_id: productId, quantity }).pipe(
      tap(res => {
        if (res.success) {
          this.notify.success('Produk berhasil ditambahkan ke keranjang');
          this.loadCart().subscribe();
        }
      })
    );
  }

  updateQuantity(itemId: string, quantity: number): Observable<APIResponse<null>> {
    return this.http.put<APIResponse<null>>(`/api/v1/orders/cart/${itemId}`, { quantity }).pipe(
      tap(res => {
        if (res.success) {
          this.loadCart().subscribe();
        }
      })
    );
  }

  removeItem(itemId: string): Observable<APIResponse<null>> {
    return this.http.delete<APIResponse<null>>(`/api/v1/orders/cart/${itemId}`).pipe(
      tap(res => {
        if (res.success) {
          this.notify.info('Item dihapus dari keranjang');
          this.loadCart().subscribe();
        }
      })
    );
  }

  checkout(payload: {
    shipping_address_id: string;
    warehouse_id: string;
    courier_name: string;
    voucher_code?: string;
  }): Observable<APIResponse<Order>> {
    return this.http.post<APIResponse<Order>>('/api/v1/orders/checkout', payload).pipe(
      tap(res => {
        if (res.success) {
          this.notify.success('Pesanan berhasil dibuat!');
          this.cart.set(null);
        }
      })
    );
  }
}
