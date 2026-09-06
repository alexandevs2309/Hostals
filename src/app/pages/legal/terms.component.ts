import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GosAuthCard } from '@/app/shared/components/auth-card';

@Component({
    selector: 'app-terms',
    standalone: true,
    imports: [RouterModule, CommonModule, GosAuthCard],
    template: `
<gos-auth-card
    icon="pi pi-file-text"
    eyebrow="Documentos Legales"
    title="Términos de Servicio"
    subtitle="Lea detenidamente antes de usar Hospitality OS"
>
    <div class="legal-content">
        <section class="legal-section">
            <h2>1. Objeto y Aceptación</h2>
            <p>Los presentes Términos de Servicio (en adelante, "Términos") regulan el acceso y uso de la plataforma <strong>Hospitality OS</strong> (en adelante, "la Plataforma" o "el Servicio"), propiedad de <strong>Hospitality OS, S.R.L.</strong> (en adelante, "el Proveedor"), sociedad comercial debidamente constituida bajo las leyes de la República Dominicana, con RNC <strong>1-31-XXXXX-X</strong>, domiciliada en <strong>Santo Domingo, Distrito Nacional, República Dominicana</strong>.</p>
            <p>Al acceder, registrarse o utilizar la Plataforma, usted (en adelante, "el Usuario", "el Cliente" o "Usted") declara haber leído, entendido y aceptado íntegramente estos Términos, así como la <a routerLink="/legal/privacidad" class="legal-link">Política de Privacidad</a>. Si no está de acuerdo, no debe usar el Servicio.</p>
        </section>

        <section class="legal-section">
            <h2>2. Definiciones</h2>
            <ul class="legal-list">
                <li><strong>Plataforma / Servicio:</strong> El software como servicio (SaaS) Hospitality OS, accesible vía web y/o API, destinado a la gestión hotelera (PMS, reservas, habitaciones, housekeeping, mantenimiento, finanzas, analytics).</li>
                <li><strong>Cliente / Usuario:</strong> Persona física o jurídica que suscribe el contrato, acepta estos Términos y accede al Servicio.</li>
                <li><strong>Datos del Cliente:</strong> Información, datos, contenidos y materiales que el Cliente ingrese, procese o almacene en la Plataforma.</li>
                <li><strong>Propiedad / Establecimiento:</strong> Hotel, resort, villa, apartahotel, hostal, bed & breakfast u otro tipo de alojamiento gestionado mediante la Plataforma.</li>
                <li><strong>Leyes Aplicables:</strong> Conjunto de normas de la República Dominicana que regulan este contrato (ver Cláusula 18).</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>3. Naturaleza del Servicio</h2>
            <p>Hospitality OS es una plataforma <strong>Software as a Service (SaaS)</strong> destinada exclusivamente a la <strong>gestión profesional de establecimientos de hospedaje</strong>. El Servicio incluye, según el plan contratado:</p>
            <ul class="legal-list">
                <li>Gestión de Propiedades (PMS)</li>
                <li>Motor de Reservas y Channel Manager</li>
                <li>Gestión de Habitaciones e Inventario</li>
                <li>Housekeeping y Mantenimiento</li>
                <li>Módulo Financiero y Facturación (cumplimiento DGII)</li>
                <li>Analytics y Reportes</li>
                <li>API para integraciones</li>
            </ul>
            <p>El Proveedor se reserva el derecho de modificar, suspender o descontinuar funcionalidades, notificando con antelación razonable.</p>
        </section>

        <section class="legal-section">
            <h2>4. Registro y Cuenta</h2>
            <ol class="legal-list-numbered">
                <li>El Cliente debe ser mayor de 18 años y tener capacidad legal para contratar bajo leyes dominicanas.</li>
                <li>El registro requiere información veraz, completa y actualizada: nombre, apellidos, email corporativo, contraseña, datos de la propiedad.</li>
                <li>El Cliente es responsable de la confidencialidad de sus credenciales y de toda actividad bajo su cuenta.</li>
                <li>Una cuenta por propiedad/establecimiento. Cuentas duplicadas podrán ser suspendidas.</li>
                <li>El Cliente notificará inmediatamente cualquier uso no autorizado de su cuenta.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>5. Período de Prueba y Suscripción</h2>
            <ol class="legal-list-numbered">
                <li>El Servicio ofrece un <strong>período de prueba gratuito de 14 días</strong> sin requerir tarjeta de crédito.</li>
                <li>Finalizado el período, el Cliente deberá suscribir un plan de pago para continuar usando el Servicio.</li>
                <li>Los planes se facturan mensual o anualmente por anticipado, en <strong>Dólares Estadounidenses (USD)</strong> o <strong>Pesos Dominicanos (DOP)</strong> según convenio.</li>
                <li>Los precios no incluyen ITBIS (18%) ni retenciones aplicables según Ley 253-12 y modificaciones.</li>
                <li>El Proveedor podrá ajustar precios con 30 días de notificación previa.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>6. Facturación, Pagos e Impuestos (DGII)</h2>
            <ol class="legal-list-numbered">
                <li>La facturación se emite conforme a la <strong>Normativa DGII (Reglamento 254-06, Ley 253-12)</strong>: NCF (Número de Comprobante Fiscal), RNC del emisor y receptor, ITBIS desglosado.</li>
                <li>El Cliente autoriza la emisión de comprobantes fiscales electrónicos (e-CF) a su RNC.</li>
                <li>Pagos: tarjeta de crédito/débito (pasarela PCI-DSS), transferencia bancaria, o domiciliación. Mora: 1.5% mensual + gastos de cobranza.</li>
                <li>Retenciones: El Cliente actuará como agente de retención (ISR 10%, ITBIS 30% del ITBIS facturado) según Ley 253-12, emitiendo constancia al Proveedor.</li>
                <li>Incumplimiento de pago > 15 días: suspensión del Servicio; > 30 días: rescisión y eliminación de datos (previa notificación).</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>7. Propiedad Intelectual</h2>
            <ol class="legal-list-numbered">
                <li>La Plataforma, código, diseño, marcas, logos, documentación y tecnología subyacente son propiedad exclusiva del Proveedor, protegidos por <strong>Ley 65-00 de Derecho de Autor</strong> y <strong>Ley 20-00 de Propiedad Industrial</strong>.</li>
                <li>El Cliente obtiene una licencia <strong>revocable, no exclusiva, intransferible</strong> para usar el Servicio durante la vigencia del contrato.</li>
                <li>Queda prohibido: ingeniería inversa, descompilación, copia, distribución, sublicencia, o creación de obras derivadas.</li>
                <li>Los Datos del Cliente son propiedad del Cliente. El Proveedor solo los procesa según instrucciones (ver Política de Privacidad).</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>8. Datos del Cliente y Privacidad</h2>
            <ol class="legal-list-numbered">
                <li>El Cliente es <strong>Responsable del Tratamiento</strong> de los datos personales que ingrese (huéspedes, empleados, proveedores). El Proveedor actúa como <strong>Encargado del Tratamiento</strong>.</li>
                <li>El tratamiento se rige por la <strong>Ley 172-13 de Protección de Datos Personales</strong> y su Reglamento.</li>
                <li>Detalles completos en la <a routerLink="/legal/privacidad" class="legal-link">Política de Privacidad</a>.</li>
                <li>El Cliente garantiza tener base legal (consentimiento, contrato, interés legítimo) para tratar datos de huéspedes/empleados.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>9. Obligaciones del Cliente</h2>
            <ul class="legal-list">
                <li>Usar el Servicio solo para fines lícitos y según su objeto (gestión hotelera).</li>
                <li>No compartir credenciales, no permitir acceso no autorizado.</li>
                <li>Mantener la exactitud de datos de la propiedad, tarifas, disponibilidad.</li>
                <li>Cumplir normativa turística (Ley 158-01, MITUR), fiscal (DGII), laboral (Código de Trabajo), y de protección al consumidor (Ley 358-05).</li>
                <li>No interferir con la seguridad, integridad o rendimiento de la Plataforma.</li>
                <li>Indemnizar al Proveedor por reclamos derivados de uso indebido o incumplimiento.</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>10. Disponibilidad, Mantenimiento y SLA</h2>
            <ol class="legal-list-numbered">
                <li>El Proveedor procurará <strong>99.5% de disponibilidad mensual</strong> (excluyendo mantenimiento programado).</li>
                <li>Mantenimiento programado: notificación ≥ 48 horas, preferiblemente horarios de baja ocupación (madrugada).</li>
                <li>Soporte: canal de tickets/email, respuesta ≤ 8 horas hábiles (críticos ≤ 2 horas).</li>
                <li>Fuerza mayor, fallos de terceros (pasarelas, DNS, ISP), o actos de autoridad eximen responsabilidad.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>11. Respaldo y Recuperación de Datos</h2>
            <ol class="legal-list-numbered">
                <li>Backups automáticos diarios, retención 30 días, replicación geográfica.</li>
                <li>RPO ≤ 24h, RTO ≤ 4h para incidente crítico.</li>
                <li>El Cliente puede solicitar exportación de sus datos (JSON/CSV/PDF) en cualquier momento.</li>
                <li>Tras cancelación: datos disponibles para exportación 30 días; luego eliminación segura (NIST 800-88).</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>12. Seguridad</h2>
            <ul class="legal-list">
                <li>Cifrado TLS 1.3 en tránsito; AES-256 en reposo.</li>
                <li>Autenticación robusta (opción 2FA/MFA).</li>
                <li>Control de acceso basado en roles (RBAC), principio de menor privilegio.</li>
                <li>Monitoreo 24/7, WAF, DDoS protection, escaneo de vulnerabilidades trimestral.</li>
                <li>Plan de respuesta a incidentes; notificación al Cliente y a INDOTEL/ProConsumidor si aplica (Ley 172-13, Art. 23).</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>13. Limitación de Responsabilidad</h2>
            <ol class="legal-list-numbered">
                <li>El Servicio se provee "tal cual" y "según disponibilidad". Sin garantías implícitas de comerciabilidad, idoneidad o no infracción.</li>
                <li>Responsabilidad total del Proveedor ≤ <strong>12 meses de fees pagados</strong> por el Cliente.</li>
                <li>Exclusión: daños indirectos, incidentales, consecuentes, lucro cesante, pérdida de datos (salvo dolo/culpa grave).</li>
                <li>El Proveedor no responde por: errores de datos ingresados por el Cliente, actos de huéspedes/terceros, fallos de conectividad del Cliente, cambios regulatorios.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>14. Suspensión y Terminación</h2>
            <ol class="legal-list-numbered">
                <li>Por el Cliente: notificación escrita 30 días antes; sin reembolso de período en curso (salvo fallo del Proveedor).</li>
                <li>Por el Proveedor: incumplimiento pago, uso ilícito, violación seguridad, orden judicial/autoridad competente.</li>
                <li>Efectos terminación: (a) cese de acceso; (b) exportación de datos 30 días; (c) eliminación segura; (d) facturación prorrateada.</li>
                <li>Supervivencia: cláusulas 7, 8, 13, 14, 18, 19.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>15. Cumplimiento Normativo Dominicano</h2>
            <p>El Cliente reconoce que el Servicio facilita el cumplimiento, pero <strong>no sustituye</strong> sus obligaciones legales:</p>
            <ul class="legal-list">
                <li><strong>DGII:</strong> Facturación electrónica (e-CF), ITBIS, ISR, retenciones, declaraciones mensuales/anuales.</li>
                <li><strong>MITUR:</strong> Registro de hospedaje, reporte de ocupación, licencia de operación.</li>
                <li><strong>Ley 358-05 (ProConsumidor):</strong> Derechos del huésped, publicidad veraz, cláusulas abusivas prohibidas.</li>
                <li><strong>Ley 16-92 (Código de Trabajo):</strong> Contratos, nóminas, seguridad social (TSS), seguridad y salud (DIGESETT/IDOPRIL).</li>
                <li><strong>Ley 172-13:</strong> Derechos del titular (acceso, rectificación, cancelación, oposición), registro de bases de datos ante INDOTEL.</li>
                <li><strong>Ley 53-07:</strong> Seguridad informática, reporte de incidentes cibernéticos.</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>16. Modificaciones al Servicio y a los Términos</h2>
            <ol class="legal-list-numbered">
                <li>El Proveedor podrá modificar el Servicio (funcionalidades, UI, API) notificando ≥ 15 días.</li>
                <li>Modificaciones a estos Términos: notificación ≥ 30 días vía email y banner en la Plataforma. Uso continuado = aceptación.</li>
                <li>Cambios legales/regulatorios: aplicación inmediata con notificación posterior.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>17. Cesión y Subcontratación</h2>
            <ol class="legal-list-numbered">
                <li>El Proveedor podrá ceder derechos/obligaciones a afiliadas o en fusión/adquisición, notificando al Cliente.</li>
                <li>Subcontratación: hosting (AWS/GCP/Azure), pasarelas de pago, email/SMS, analytics — bajo cláusulas de confidencialidad y DPA.</li>
                <li>El Cliente no podrá ceder sin consentimiento escrito del Proveedor.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>18. Ley Aplicable y Jurisdicción</h2>
            <p>Estos Términos se rigen por las <strong>leyes de la República Dominicana</strong>. Cualquier controversia se someterá a los <strong>Tribunales Ordinarios del Distrito Nacional, Santo Domingo</strong>, renunciando a cualquier otro fuero.</p>
            <p>Leyes principales: Constitución, Código Civil, Código de Comercio, Ley 172-13, Ley 358-05, Ley 20-00, Ley 53-07, Ley 158-01, Ley 358-05, Ley 253-12, Ley 65-00, Ley 20-00, Código de Trabajo, normativa DGII, MITUR, INDOTEL, ProConsumidor.</p>
        </section>

        <section class="legal-section">
            <h2>19. Disposiciones Generales</h2>
            <ol class="legal-list-numbered">
                <li><strong>Acuerdo completo:</strong> Estos Términos + Política de Privacidad + Order Form = acuerdo íntegro.</li>
                <li><strong>Divisibilidad:</strong> Nulidad de una cláusula no afecta las demás.</li>
                <li><strong>No renuncia:</strong> Tolerancia no implica renuncia a derechos.</li>
                <li><strong>Notificaciones:</strong> Válidas vía email registrado, banner en Plataforma, o carta certificada a domicilio legal.</li>
                <li><strong>Idioma:</strong> Versión en español prevalece sobre traducciones.</li>
            </ol>
        </section>

        <section class="legal-section final-section">
            <h2>20. Contacto</h2>
            <p>Para consultas sobre estos Términos:</p>
            <address>
                <strong>Hospitality OS, S.R.L.</strong><br>
                RNC: 1-31-XXXXX-X<br>
                Santo Domingo, Distrito Nacional, República Dominicana<br>
                Email: legal&#64;hospitalityos.com<br>
                Tel: +1 (809) XXX-XXXX
            </address>
            <p class="text-center mt-4">
                <a routerLink="/account/register" class="gos-btn gos-btn--primary">Aceptar y Registrarse</a>
            </p>
        </section>
    </div>
</gos-auth-card>
`,
    styles: [`
        .legal-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: left;
        }
        .legal-section {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--hos-border);
        }
        .legal-section:last-of-type {
            border-bottom: none;
        }
        .legal-section h2 {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--hos-text);
            margin-bottom: 0.75rem;
        }
        .legal-section p {
            font-size: 0.9375rem;
            line-height: 1.7;
            color: var(--hos-text);
            margin-bottom: 0.75rem;
        }
        .legal-list, .legal-list-numbered {
            margin: 0.75rem 0 0 1.5rem;
            padding-left: 1rem;
        }
        .legal-list li, .legal-list-numbered li {
            font-size: 0.9375rem;
            line-height: 1.7;
            color: var(--hos-text);
            margin-bottom: 0.5rem;
        }
        .legal-link {
            color: var(--hos-brand);
            text-decoration: none;
            font-weight: 500;
        }
        .legal-link:hover {
            text-decoration: underline;
        }
        address {
            font-style: normal;
            font-size: 0.9375rem;
            line-height: 1.7;
            color: var(--hos-text-muted);
        }
        .final-section {
            border-top: 2px solid var(--hos-brand);
            padding-top: 1.5rem;
            margin-top: 1rem;
        }
    `]
})
export class TermsComponent {}
