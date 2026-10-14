import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  CATEGORIAS_ESPACIOS,
  ESPACIOS_PREDEFINIDOS,
  EstadoTicket,
  Inspeccion,
  PLANTILLAS_RAPIDAS,
  Prioridad,
  TIPOS_NOVEDADES_CONFIG
} from '../models/inspeccion.model';
import { InspeccionesService } from '../services/inspecciones.service';
import { NetworkStatusService } from '../services/network-status.service';
import { ConnectionStatus } from '@capacitor/network';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  // Catálogos
  categoriasEspacios = CATEGORIAS_ESPACIOS;
  espaciosLista = ESPACIOS_PREDEFINIDOS;
  tiposNovedadConfig = TIPOS_NOVEDADES_CONFIG;
  plantillasRapidas = PLANTILLAS_RAPIDAS;

  // Colecciones reactivas
  inspecciones: Inspeccion[] = [];
  inspeccionesFiltradas: Inspeccion[] = [];

  // Pestaña activa
  segmentoActivo: 'dashboard' | 'formulario' | 'listado' = 'dashboard';

  // Filtros
  filtroPrioridad: 'Todas' | Prioridad = 'Todas';
  filtroEstado: 'Todos' | EstadoTicket = 'Todos';
  terminoBusqueda = '';

  // Modelo del formulario
  nuevoEspacio = '';
  categoriaSeleccionada = 'Aulas de Clase';
  espacioPersonalizado = '';
  nuevoTipoNovedad = '';
  tipoNovedadPersonalizado = '';
  nuevaPrioridad: Prioridad = 'Media';
  nuevaDescripcion = '';
  nuevoInspector = '';

  // Estado de red
  estadoRed: ConnectionStatus = { connected: true, connectionType: 'wifi' };
  private subs: Subscription[] = [];
  private primerEstadoRecibido = false;

  constructor(
    private inspeccionesService: InspeccionesService,
    private networkService: NetworkStatusService,
    private toastController: ToastController,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    const subInspecciones = this.inspeccionesService.inspecciones$.subscribe(lista => {
      this.inspecciones = lista;
      this.aplicarFiltros();
    });
    this.subs.push(subInspecciones);

    const subNetwork = this.networkService.status$.subscribe(status => {
      const estadoAnterior = this.estadoRed.connected;
      this.estadoRed = status;

      if (this.primerEstadoRecibido && estadoAnterior !== status.connected) {
        this.mostrarToastEstadoRed(status.connected);
      }
      this.primerEstadoRecibido = true;
    });
    this.subs.push(subNetwork);
  }

  ionViewWillEnter() {
    this.inspeccionesService.cargarDesdeAlmacenamiento();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  // ==========================================
  // FORMULARIO Y REGISTRO
  // ==========================================

  seleccionarPlantilla(texto: string) {
    if (this.nuevaDescripcion) {
      this.nuevaDescripcion += ' ' + texto;
    } else {
      this.nuevaDescripcion = texto;
    }
  }

  async registrarInspeccion() {
    const espacioFinal = this.nuevoEspacio === 'Otro espacio personalizado'
      ? this.espacioPersonalizado.trim()
      : this.nuevoEspacio.trim();

    const tipoFinal = this.nuevoTipoNovedad === 'Otra Novedad Institucional'
      ? (this.tipoNovedadPersonalizado.trim() || 'Otra Novedad')
      : this.nuevoTipoNovedad.trim();

    if (!espacioFinal) {
      await this.mostrarToast('Por favor indica el espacio o área a auditar.', 'warning');
      return;
    }

    if (!tipoFinal) {
      await this.mostrarToast('Por favor selecciona la categoría de novedad.', 'warning');
      return;
    }

    if (!this.nuevaDescripcion.trim()) {
      await this.mostrarToast('Por favor escribe una descripción del hallazgo.', 'warning');
      return;
    }

    try {
      const nuevoRegistro = await this.inspeccionesService.agregarInspeccion({
        espacio: espacioFinal,
        categoriaEspacio: this.categoriaSeleccionada,
        tipoNovedad: tipoFinal,
        prioridad: this.nuevaPrioridad,
        descripcion: this.nuevaDescripcion,
        inspector: this.nuevoInspector.trim() || 'Auditor Líder'
      });

      await this.mostrarToast(`Auditoría #${nuevoRegistro.codigoRef} registrada y guardada localmente.`, 'success');
      this.limpiarFormulario();
      this.segmentoActivo = 'listado';
    } catch (error) {
      console.error('Error al guardar inspección:', error);
      await this.mostrarToast('Error al persistir en almacenamiento.', 'danger');
    }
  }

  limpiarFormulario() {
    this.nuevoEspacio = '';
    this.espacioPersonalizado = '';
    this.nuevoTipoNovedad = '';
    this.tipoNovedadPersonalizado = '';
    this.nuevaPrioridad = 'Media';
    this.nuevaDescripcion = '';
    this.nuevoInspector = '';
  }

  // ==========================================
  // GESTIÓN DE ESTADOS Y ACCIONES
  // ==========================================

  async abrirMenuAcciones(item: Inspeccion) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: `Gestión #${item.codigoRef} - ${item.espacio}`,
      buttons: [
        {
          text: 'Marcar como "En Proceso"',
          icon: 'time-outline',
          handler: () => {
            this.inspeccionesService.cambiarEstado(item.id, 'En Proceso');
            this.mostrarToast('Estado actualizado a "En Proceso"', 'primary');
          }
        },
        {
          text: 'Marcar como "Atendido / Resuelto"',
          icon: 'checkmark-circle-outline',
          handler: () => {
            this.inspeccionesService.cambiarEstado(item.id, 'Atendido');
            this.mostrarToast('Estado actualizado a "Atendido"', 'success');
          }
        },
        {
          text: 'Eliminar Registro',
          role: 'destructive',
          icon: 'trash-outline',
          handler: () => {
            this.confirmarEliminacion(item);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });
    await actionSheet.present();
  }

  async confirmarEliminacion(inspeccion: Inspeccion) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      subHeader: `#${inspeccion.codigoRef} - ${inspeccion.espacio}`,
      message: '¿Confirma que desea remover este registro de auditoría? El cambio se reflejará de inmediato en el almacenamiento persistente.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.inspeccionesService.eliminarInspeccion(inspeccion.id);
            await this.mostrarToast('Registro eliminado del almacenamiento.', 'medium');
          }
        }
      ]
    });
    await alert.present();
  }

  async exportarReporteEjecutivo() {
    const total = this.inspecciones.length;
    const altas = this.contarPorPrioridad('Alta');
    const media = this.contarPorPrioridad('Media');
    const bajas = this.contarPorPrioridad('Baja');

    const alert = await this.alertController.create({
      header: 'Informe Ejecutivo Generado',
      subHeader: `CampusAudit Suite • ${new Date().toLocaleDateString('es-CO')}`,
      message: `
        <strong>Resumen de Inspección Institucional:</strong><br><br>
        • <strong>Total Registros:</strong> ${total}<br>
        • <strong>Críticas / Alta Prioridad:</strong> ${altas}<br>
        • <strong>Prioridad Media:</strong> ${media}<br>
        • <strong>Prioridad Baja:</strong> ${bajas}<br>
        • <strong>Estado del Sistema:</strong> Local Storage 100% Persistido<br><br>
        <em>Listo para exportación a Decanatura y Dirección de Infraestructura.</em>
      `,
      buttons: ['Cerrar Resumen']
    });
    await alert.present();
  }

  // ==========================================
  // FILTROS Y MÉTRICAS
  // ==========================================

  filtrarPorPrioridad(prioridad: 'Todas' | Prioridad) {
    this.filtroPrioridad = prioridad;
    this.aplicarFiltros();
  }

  onBuscar(event: any) {
    this.terminoBusqueda = event.detail?.value || '';
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = [...this.inspecciones];

    if (this.filtroPrioridad !== 'Todas') {
      resultado = resultado.filter(i => i.prioridad === this.filtroPrioridad);
    }

    if (this.terminoBusqueda.trim()) {
      const q = this.terminoBusqueda.toLowerCase().trim();
      resultado = resultado.filter(i =>
        i.espacio.toLowerCase().includes(q) ||
        i.tipoNovedad.toLowerCase().includes(q) ||
        i.descripcion.toLowerCase().includes(q) ||
        i.codigoRef.toLowerCase().includes(q) ||
        (i.inspector && i.inspector.toLowerCase().includes(q))
      );
    }

    this.inspeccionesFiltradas = resultado;
  }

  contarPorPrioridad(p: Prioridad): number {
    return this.inspecciones.filter(i => i.prioridad === p).length;
  }

  calcularPorcentajeSalud(): number {
    if (this.inspecciones.length === 0) return 100;
    const altas = this.contarPorPrioridad('Alta');
    const medias = this.contarPorPrioridad('Media');
    const penalizacion = (altas * 12) + (medias * 4);
    return Math.max(25, 100 - penalizacion);
  }

  formatearFecha(fechaIso: string): string {
    if (!fechaIso) return '';
    try {
      const d = new Date(fechaIso);
      return d.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaIso;
    }
  }

  obtenerIconoTipo(tipoNombre: string): string {
    const match = this.tiposNovedadConfig.find(t => t.tipo === tipoNombre);
    return match ? match.icono : 'alert-circle-outline';
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger' | 'medium' | 'primary' = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom',
      color: color,
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  private async mostrarToastEstadoRed(conectado: boolean) {
    const toast = await this.toastController.create({
      message: conectado
        ? 'Conectado a la Red Institucional'
        : 'Modo Offline Activado: Persistencia local garantizada',
      duration: 3000,
      position: 'top',
      color: conectado ? 'success' : 'dark'
    });
    await toast.present();
  }
}
