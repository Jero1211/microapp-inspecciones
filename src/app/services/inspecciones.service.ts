import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';
import { EstadoTicket, Inspeccion, Prioridad } from '../models/inspeccion.model';

const STORAGE_KEY = 'campus_audit_pro_inspecciones_v2';

@Injectable({
  providedIn: 'root'
})
export class InspeccionesService {
  private inspeccionesSubject = new BehaviorSubject<Inspeccion[]>([]);
  public inspecciones$: Observable<Inspeccion[]> = this.inspeccionesSubject.asObservable();

  constructor() {
    this.cargarDesdeAlmacenamiento();
  }

  /**
   * Carga la colección de inspecciones almacenadas en @capacitor/preferences
   */
  public async cargarDesdeAlmacenamiento(): Promise<Inspeccion[]> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        const parsed: Inspeccion[] = JSON.parse(value);
        this.inspeccionesSubject.next(parsed);
        return parsed;
      } else {
        // Sembrar 2 registros de demostración iniciales para mostrar el potencial de la suite si está vacía
        const demoData: Inspeccion[] = [
          {
            id: 'insp_' + Date.now(),
            codigoRef: 'AUD-1042',
            espacio: 'Laboratorio de Redes & Cisco',
            categoriaEspacio: 'Laboratorios',
            tipoNovedad: 'Conectividad Wi-Fi o Cableado de Red',
            prioridad: 'Alta',
            descripcion: 'Switch de rack 2 sin enlace a fibra principal. 12 puestos de trabajo sin conexión a red interna.',
            fechaRegistro: new Date(Date.now() - 3600000 * 2).toISOString(),
            inspector: 'Ing. Carlos Mendoza (Auditor TI)',
            estado: 'En Proceso'
          },
          {
            id: 'insp_' + (Date.now() + 1),
            codigoRef: 'AUD-1041',
            espacio: 'Aula Magna - Bloque A',
            categoriaEspacio: 'Aulas de Clase',
            tipoNovedad: 'Equipos Audiovisuales / VideoBeam',
            prioridad: 'Media',
            descripcion: 'Lámpara de proyector principal con advertencia de vida útil. Imagen proyectada con tono amarillento.',
            fechaRegistro: new Date(Date.now() - 3600000 * 5).toISOString(),
            inspector: 'Lic. Laura Restrepo',
            estado: 'Registrado'
          }
        ];
        this.inspeccionesSubject.next(demoData);
        await this.guardarEnAlmacenamiento(demoData);
        return demoData;
      }
    } catch (error) {
      console.error('Error al cargar inspecciones desde Preferences:', error);
      this.inspeccionesSubject.next([]);
      return [];
    }
  }

  public obtenerInspecciones(): Inspeccion[] {
    return this.inspeccionesSubject.getValue();
  }

  /**
   * Agrega una nueva inspección a la colección y persiste los cambios
   */
  public async agregarInspeccion(datos: {
    espacio: string;
    categoriaEspacio?: string;
    tipoNovedad: string;
    prioridad: Prioridad;
    descripcion: string;
    inspector?: string;
  }): Promise<Inspeccion> {
    const consecutivo = Math.floor(1000 + Math.random() * 9000);
    const nueva: Inspeccion = {
      id: 'insp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      codigoRef: `AUD-${consecutivo}`,
      espacio: datos.espacio.trim(),
      categoriaEspacio: datos.categoriaEspacio || 'Académico',
      tipoNovedad: datos.tipoNovedad.trim(),
      prioridad: datos.prioridad,
      descripcion: datos.descripcion.trim(),
      fechaRegistro: new Date().toISOString(),
      inspector: datos.inspector?.trim() || 'Auditor Institucional',
      estado: 'Registrado'
    };

    const listaActual = [nueva, ...this.inspeccionesSubject.getValue()];
    this.inspeccionesSubject.next(listaActual);
    await this.guardarEnAlmacenamiento(listaActual);
    return nueva;
  }

  /**
   * Cambia el estado de atención de una inspección
   */
  public async cambiarEstado(id: string, nuevoEstado: EstadoTicket): Promise<void> {
    const lista = this.inspeccionesSubject.getValue().map(item => {
      if (item.id === id) {
        return { ...item, estado: nuevoEstado };
      }
      return item;
    });
    this.inspeccionesSubject.next(lista);
    await this.guardarEnAlmacenamiento(lista);
  }

  /**
   * Elimina una inspección por su ID y actualiza el almacenamiento local persistente
   */
  public async eliminarInspeccion(id: string): Promise<boolean> {
    const listaActual = this.inspeccionesSubject.getValue();
    const filtrada = listaActual.filter(item => item.id !== id);

    if (filtrada.length !== listaActual.length) {
      this.inspeccionesSubject.next(filtrada);
      await this.guardarEnAlmacenamiento(filtrada);
      return true;
    }
    return false;
  }

  private async guardarEnAlmacenamiento(lista: Inspeccion[]): Promise<void> {
    try {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(lista)
      });
    } catch (error) {
      console.error('Error al guardar en Preferences:', error);
      throw error;
    }
  }

  public async limpiarTodo(): Promise<void> {
    this.inspeccionesSubject.next([]);
    await Preferences.remove({ key: STORAGE_KEY });
  }
}
