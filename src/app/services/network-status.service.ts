import { Injectable, NgZone } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private statusSubject = new BehaviorSubject<ConnectionStatus>({
    connected: true,
    connectionType: 'wifi'
  });

  public status$: Observable<ConnectionStatus> = this.statusSubject.asObservable();

  constructor(private ngZone: NgZone) {
    this.iniciarMonitoreoRed();
  }

  private async iniciarMonitoreoRed() {
    try {
      // Estado inicial
      const estadoActual = await Network.getStatus();
      this.statusSubject.next(estadoActual);

      // Escuchador de cambios en tiempo real
      Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
        this.ngZone.run(() => {
          this.statusSubject.next(status);
        });
      });
    } catch (error) {
      console.warn('No se pudo inicializar Capacitor Network, usando fallback de navegador:', error);
      this.statusSubject.next({
        connected: navigator.onLine,
        connectionType: 'unknown'
      });

      window.addEventListener('online', () => {
        this.ngZone.run(() => {
          this.statusSubject.next({ connected: true, connectionType: 'unknown' });
        });
      });

      window.addEventListener('offline', () => {
        this.ngZone.run(() => {
          this.statusSubject.next({ connected: false, connectionType: 'none' });
        });
      });
    }
  }

  public obtenerEstadoActual(): ConnectionStatus {
    return this.statusSubject.getValue();
  }

  public estaConectado(): boolean {
    return this.statusSubject.getValue().connected;
  }
}
