import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User, UserKYC, ApiResponse } from '../../../core/models/types';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container users-mgmt-page">
      <div class="page-header">
        <div>
          <span class="badge badge-purple">Super Admin Console</span>
          <h1 class="page-title">Kelola Pengguna & Verifikasi KYC</h1>
          <p class="text-secondary">Manajemen akun terdaftar, pembagian peran akses sistem, dan verifikasi identitas legal.</p>
        </div>
        <div class="header-actions">
          <button (click)="loadAllData()" class="btn btn-outline" [disabled]="loading()">
            🔄 Refresh
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="tabs mb-6">
        <button 
          (click)="activeTab = 'users'" 
          class="tab-btn" 
          [class.active]="activeTab === 'users'"
        >
          👥 Pengguna Terdaftar ({{ users().length }})
        </button>
        <button 
          (click)="activeTab = 'kyc'" 
          class="tab-btn" 
          [class.active]="activeTab === 'kyc'"
        >
          🪪 Verifikasi KYC ({{ kycList().length }})
        </button>
      </div>

      <!-- TAB 1: USERS LIST -->
      @if (activeTab === 'users') {
        <div class="card p-0">
          <div class="p-4 border-b flex justify-between items-center">
            <div class="search-box">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Cari email, nama atau role..." 
                class="form-control"
              />
            </div>
            <span class="text-sm text-secondary">
              Total {{ filteredUsers().length }} pengguna aktif
            </span>
          </div>

          @if (loading()) {
            <div class="p-8 text-center">
              <div class="spinner"></div>
              <p class="mt-2 text-secondary">Memuat data pengguna...</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nama Lengkap</th>
                    <th>Email Pengguna</th>
                    <th>Nomor Telepon</th>
                    <th>Hak Akses (Role)</th>
                    <th>Status Akun</th>
                    <th>Terdaftar Pada</th>
                  </tr>
                </thead>
                <tbody>
                  @for (u of filteredUsers(); track u.id) {
                    <tr>
                      <td class="font-semibold">{{ u.full_name }}</td>
                      <td class="font-mono text-sm text-primary">{{ u.email }}</td>
                      <td class="text-secondary text-sm">{{ u.phone_number || '-' }}</td>
                      <td>
                        <span class="role-badge" [ngClass]="getRoleClass(u.role)">
                          {{ u.role || 'CUSTOMER' }}
                        </span>
                      </td>
                      <td>
                        @if (u.is_active) {
                          <span class="badge badge-success">AKTIF</span>
                        } @else {
                          <span class="badge badge-danger">NONAKTIF</span>
                        }
                      </td>
                      <td class="text-secondary text-xs">
                        {{ u.created_at | date:'dd MMM yyyy, HH:mm' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }

      <!-- TAB 2: KYC VERIFICATION -->
      @if (activeTab === 'kyc') {
        <div class="card p-0">
          <div class="p-4 border-b">
            <h3 class="font-bold text-lg">Antrean Verifikasi Identitas Nasabah (KYC)</h3>
            <p class="text-sm text-secondary">Persetujuan KYC membuka limit saldo dompet digital dan transaksi grosir.</p>
          </div>

          @if (loading()) {
            <div class="p-8 text-center">
              <div class="spinner"></div>
              <p class="mt-2 text-secondary">Memuat antrean KYC...</p>
            </div>
          } @else if (kycList().length === 0) {
            <div class="p-8 text-center text-secondary">
              <p>Belum ada pengajuan KYC identitas baru.</p>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nama Tertera</th>
                    <th>Nomor KTP/NIK</th>
                    <th>Tanggal Pengajuan</th>
                    <th>Status KYC</th>
                    <th class="text-right">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  @for (kyc of kycList(); track kyc.id) {
                    <tr>
                      <td class="font-semibold">{{ kyc.full_name }}</td>
                      <td class="font-mono font-bold">{{ kyc.id_card_number }}</td>
                      <td class="text-secondary text-sm">
                        {{ kyc.submitted_at | date:'dd MMM yyyy, HH:mm' }}
                      </td>
                      <td>
                        @switch (kyc.verification_status) {
                          @case ('APPROVED') {
                            <span class="badge badge-success">VERIFIED</span>
                          }
                          @case ('REJECTED') {
                            <span class="badge badge-danger">DITOLAK</span>
                          }
                          @default {
                            <span class="badge badge-warning">MENUNGGU VERIFIKASI</span>
                          }
                        }
                      </td>
                      <td class="text-right">
                        @if (kyc.verification_status === 'PENDING') {
                          <div class="action-btns">
                            <button (click)="verifyKYC(kyc.id, 'APPROVED')" class="btn btn-primary btn-sm">
                              ✅ Setujui
                            </button>
                            <button (click)="verifyKYC(kyc.id, 'REJECTED')" class="btn btn-danger btn-sm">
                              ❌ Tolak
                            </button>
                          </div>
                        } @else {
                          <span class="text-xs text-secondary">Selesai dievaluasi</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .users-mgmt-page {
      padding-bottom: 3rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0.5rem 0 0.25rem;
    }
    .badge-purple {
      background: #f3e8ff;
      color: #7e22ce;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
    }
    .tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.25rem;
    }
    .tab-btn {
      padding: 0.75rem 1.25rem;
      font-weight: 700;
      font-size: 0.875rem;
      border: none;
      background: none;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: var(--radius-md) var(--radius-md) 0 0;
      transition: all var(--transition-fast);
    }
    .tab-btn.active {
      color: var(--color-primary-dark);
      background: var(--bg-surface-secondary);
      border-bottom: 2px solid var(--color-primary);
    }
    .search-box {
      max-width: 320px;
      width: 100%;
    }
    .role-badge {
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
    }
    .role-super-admin { background: #f3e8ff; color: #7e22ce; }
    .role-warehouse-staff { background: #e0f2fe; color: #0369a1; }
    .role-courier { background: #fef3c7; color: #b45309; }
    .role-cs-agent { background: #dcfce7; color: #15803d; }
    .role-customer { background: #f1f5f9; color: #475569; }
    .action-btns {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `]
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private notify = inject(NotificationService);

  activeTab: 'users' | 'kyc' = 'users';

  users = signal<User[]>([]);
  kycList = signal<UserKYC[]>([]);
  
  loading = signal(true);
  searchQuery = '';

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading.set(true);
    this.loadUsers();
    this.loadKYC();
  }

  loadUsers() {
    this.http.get<ApiResponse<User[]>>('/api/v1/auth/users')
      .subscribe({
        next: (res) => {
          this.users.set(res.data || []);
          this.loading.set(false);
        },
        error: (err) => {
          this.notify.error('Gagal memuat daftar pengguna');
          this.loading.set(false);
        }
      });
  }

  loadKYC() {
    this.http.get<ApiResponse<UserKYC[]>>('/api/v1/auth/kyc')
      .subscribe({
        next: (res) => {
          this.kycList.set(res.data || []);
        },
        error: (err) => {
          console.error('Failed to load KYC', err);
        }
      });
  }

  filteredUsers(): User[] {
    if (!this.searchQuery.trim()) return this.users();
    const q = this.searchQuery.toLowerCase();
    return this.users().filter(u => 
      u.email.toLowerCase().includes(q) ||
      u.full_name.toLowerCase().includes(q) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  }

  verifyKYC(id: string, status: 'APPROVED' | 'REJECTED') {
    this.http.put<ApiResponse<any>>(`/api/v1/auth/kyc/${id}/verify`, {
      status: status
    }).subscribe({
      next: () => {
        this.notify.success(`Status KYC berhasil diubah menjadi ${status}`);
        this.loadKYC();
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'Gagal mengubah status KYC');
      }
    });
  }

  getRoleClass(role?: string): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'role-super-admin';
      case 'WAREHOUSE_STAFF': return 'role-warehouse-staff';
      case 'COURIER': return 'role-courier';
      case 'CS_AGENT': return 'role-cs-agent';
      default: return 'role-customer';
    }
  }
}
