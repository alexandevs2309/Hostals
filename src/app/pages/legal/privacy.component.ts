import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GosAuthCard } from '@/app/shared/components/auth-card';

@Component({
    selector: 'app-privacy',
    standalone: true,
    imports: [RouterModule, CommonModule, GosAuthCard],
    template: `
<gos-auth-card
    icon="pi pi-shield"
    eyebrow="Documentos Legales"
    title="Política de Privacidad"
    subtitle="Protección de datos según Ley 172-13 y normativa aplicable"
>
    <div class="legal-content">
        <section class="legal-section">
            <h2>1. Responsable del Tratamiento</h2>
            <p><strong>Hospitality OS, S.R.L.</strong> (en adelante, "el Responsable", "nosotros" o "el Proveedor"), sociedad dominicana, RNC 1-31-XXXXX-X, domiciliada en Santo Domingo, Distrito Nacional, República Dominicana, es el Responsable del Tratamiento de los datos personales recabados a través de la plataforma <strong>Hospitality OS</strong>.</p>
            <p>Delegado de Protección de Datos (DPO): <a href="mailto:dpo@hospitalityos.com" class="legal-link">dpo@hospitalityos.com</a></p>
        </section>

        <section class="legal-section">
            <h2>2. Marco Normativo</h2>
            <p>Esta Política se rige por:</p>
            <ul class="legal-list">
                <li><strong>Ley 172-13</strong> de Protección de Datos Personales y su Reglamento (Decreto 409-16).</li>
                <li><strong>Constitución de la República Dominicana</strong>, Art. 44 (Derecho a la intimidad, honra y propia imagen).</li>
                <li><strong>Ley 53-07</strong> sobre Crímenes y Delitos de Alta Tecnología.</li>
                <li><strong>Ley 358-05</strong> de Protección al Consumidor (ProConsumidor).</li>
                <li><strong>Ley 20-00</strong> sobre Comercio Electrónico.</li>
                <li>Normativa internacional de referencia: <strong>GDPR (UE 2016/679)</strong> como estándar de mejores prácticas.</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>3. Categorías de Datos Tratados</h2>
            <p>Tratamos las siguientes categorías según la relación:</p>
            <table class="legal-table">
                <thead>
                    <tr><th>Categoría</th><th>Datos</th><th>Base Legal</th></tr>
                </thead>
                <tbody>
                    <tr><td>Identificativos</td><td>Nombre, apellidos, cédula/RNC, email, teléfono, cargo</td><td>Ejecución contrato (Art. 8 Ley 172-13), Consentimiento</td></tr>
                    <tr><td>Autenticación</td><td>Email, hash contraseña, tokens, logs de acceso, 2FA</td><td>Interés legítimo (seguridad), Ejecución contrato</td></tr>
                    <tr><td>Datos de la Propiedad</td><td>Nombre, tipo, habitaciones, ubicación, RNC, licencia MITUR</td><td>Ejecución contrato</td></tr>
                    <tr><td>Datos de Huéspedes (ingresados por Cliente)</td><td>Nombre, documento, nacionalidad, email, teléfono, preferencias, historial estancias</td><td>Ejecución contrato (Cliente=Responsable), Consentimiento huésped</td></tr>
                    <tr><td>Datos de Empleados (ingresados por Cliente)</td><td>Nombre, cédula, cargo, turno, nómina, permisos</td><td>Ejecución contrato (Cliente=Responsable), Obligación legal (Código Trabajo, TSS)</td></tr>
                    <tr><td>Transaccionales / Financieros</td><td>Facturas, pagos, NCF, ITBIS, retenciones, método pago</td><td>Obligación legal (DGII), Ejecución contrato</td></tr>
                    <tr><td>Técnicos / Navegación</td><td>IP, user-agent, logs, cookies, device ID, eventos UI</td><td>Interés legítimo (seguridad, analítica, mejora)</td></tr>
                    <tr><td>Comunicaciones</td><td>Emails, tickets soporte, chats, consentimientos marketing</td><td>Consentimiento, Ejecución contrato, Interés legítimo</td></tr>
                </tbody>
            </table>
        </section>

        <section class="legal-section">
            <h2>4. Finalidades del Tratamiento</h2>
            <ol class="legal-list-numbered">
                <li><strong>Prestación del Servicio:</strong> Gestión PMS, reservas, check-in/out, housekeeping, mantenimiento, facturación, analytics.</li>
                <li><strong>Cumplimiento Legal:</strong> Facturación electrónica DGII (e-CF), retenciones, declaraciones fiscales, reportes MITUR, nóminas TSS/IDOPRIL.</li>
                <li><strong>Seguridad y Prevención de Fraude:</strong> Autenticación, detección intrusos, prevención acceso no autorizado, logs auditoría (Ley 53-07).</li>
                <li><strong>Soporte y Atención al Cliente:</strong> Tickets, chat, email, teléfono, base de conocimiento.</li>
                <li><strong>Mejora del Servicio:</strong> Analítica de uso (agregada/anónima), UX, rendimiento, desarrollo de features.</li>
                <li><strong>Comunicaciones:</strong> Transaccionales (facturas, alertas, alertas seguridad), operativas (mantenimiento, actualizaciones). Marketing solo con consentimiento previo, revocable.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>5. Base Jurídica (Ley 172-13, Art. 8)</h2>
            <ul class="legal-list">
                <li><strong>Ejecución de contrato:</strong> Prestación del SaaS, facturación, soporte.</li>
                <li><strong>Obligación legal:</strong> DGII (facturación, retenciones), MITUR (registro huéspedes), TSS/IDOPRIL (nóminas), Ley 53-07 (logs seguridad).</li>
                <li><strong>Interés legítimo:</strong> Seguridad, prevención fraude, analítica agregada, mejora continua.</li>
                <li><strong>Consentimiento:</strong> Marketing, cookies no esenciales, tratamiento datos sensibles (si aplica), comunicaciones promocionales. Revocable en cualquier momento.</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>6. Destinatarios y Transferencias</h2>
            <ol class="legal-list-numbered">
                <li><strong>Encargados del Tratamiento (Subprocesadores):</strong>
                    <ul class="legal-list">
                        <li>Hosting Cloud: AWS / Google Cloud / Azure (EE.UU., UE, Brasil) — cláusulas contractuales tipo (SCC) + addendum protección datos.</li>
                        <li>Pasarelas de Pago: Stripe, PayPal, culqi, Azul — PCI-DSS Level 1.</li>
                        <li>Email/Comunicaciones: SendGrid, Twilio, WhatsApp Business API.</li>
                        <li>Analítica: Mixpanel, PostHog, Google Analytics (IP anonimizada).</li>
                        <li>Monitoreo: Sentry, Datadog, Cloudflare (WAF/DDoS).</li>
                    </ul>
                </li>
                <li><strong>Autoridades Públicas:</strong> DGII, MITUR, TSS, IDOPRIL, ProConsumidor, INDOTEL, Fiscalía, Juzgados — solo por mandato legal u orden judicial.</li>
                <li><strong>Transferencias Internacionales:</strong> Solo a países con nivel adecuado (UE, Canadá, etc.) o bajo SCC + medidas suplementarias (Schrems II). No venta de datos.</li>
                <li><strong>Fusión/Adquisición:</strong> Notificación previa; nuevo responsable asume obligaciones.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>7. Derechos del Titular (Ley 172-13, Arts. 13-19)</h2>
            <p>El titular de los datos puede ejercer gratuitamente:</p>
            <ul class="legal-list">
                <li><strong>Acceso:</strong> Confirmar si tratamos sus datos, cuáles, para qué, origen, destinatarios.</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
                <li><strong>Cancelación / Supresión:</strong> Eliminar datos cuando ya no sean necesarios, revoque consentimiento, o tratamiento ilícito.</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento por interés legítimo o marketing directo.</li>
                <li><strong>Limitación:</strong> Restringir tratamiento mientras se verifica exactitud, legalidad, o ejercicio de derechos.</li>
                <li><strong>Portabilidad:</strong> Recibir datos en formato estructurado, común, interoperable (JSON/CSV).</li>
                <li><strong>No ser objeto de decisiones automatizadas:</strong> Perfilado con efectos jurídicos significativos.</li>
            </ul>
            <p><strong>Ejercicio:</strong> Email a <a href="mailto:privacidad@hospitalityos.com" class="legal-link">privacidad@hospitalityos.com</a> o formulario en <a routerLink="/account/login" class="legal-link">portal del Cliente</a>. Respuesta ≤ 15 días hábiles (Art. 16 Ley 172-13). Identificación: cédula/RNC + email registrado.</p>
        </section>

        <section class="legal-section">
            <h2>8. Plazos de Conservación</h2>
            <table class="legal-table">
                <thead>
                    <tr><th>Categoría</th><th>Plazo</th><th>Base</th></tr>
                </thead>
                <tbody>
                    <tr><td>Datos contractuales / Cuenta</td><td>Vigencia contrato + 10 años</td><td>Código Comercio Art. 34, Ley 172-13</td></tr>
                    <tr><td>Facturación / Fiscal (DGII)</td><td>10 años</td><td>Código Tributario, Normativa DGII</td></tr>
                    <tr><td>Logs de acceso / Seguridad</td><td>2 años</td><td>Ley 53-07, Interés legítimo seguridad</td></tr>
                    <tr><td>Datos de Huéspedes (operativos)</td><td>Estancia + 3 años</td><td>Ley 158-01, MITUR, Ley 172-13</td></tr>
                    <tr><td>Datos Empleados / Nómina</td><td>Vigencia laboral + 10 años</td><td>Código Trabajo, TSS, IDOPRIL</td></tr>
                    <tr><td>Marketing / Consentimiento</td><td>Hasta revocación + 2 años</td><td>Consentimiento, Ley 172-13</td></tr>
                    <tr><td>Logs técnicos / Analítica agregada</td><td>13 meses</td><td>Interés legítimo, ePrivacy</td></tr>
                </tbody>
            </table>
            <p>Transcurridos los plazos: eliminación segura (NIST 800-88) o anonimización irreversible.</p>
        </section>

        <section class="legal-section">
            <h2>9. Seguridad de la Información</h2>
            <ul class="legal-list">
                <li><strong>Cifrado:</strong> TLS 1.3 (tránsito), AES-256 (reposo), claves gestionadas en KMS/HSM.</li>
                <li><strong>Acceso:</strong> RBAC, principio menor privilegio, 2FA/MFA obligatorio para admin, revisión trimestral accesos.</li>
                <li><strong>Red:</strong> VPC aislada, Security Groups, NACLs, WAF, DDoS protection (Cloudflare/AWS Shield).</li>
                <li><strong>Desarrollo:</strong> SDLC seguro, SAST/DAST/SCA en CI/CD, revisión código, secretos en Vault.</li>
                <li><strong>Monitoreo:</strong> SIEM 24/7, alertas anomalías, respuesta incidentes < 1h (críticos).</li>
                <li><strong>Backups:</strong> Diarios, cifrados, replicación cross-region, test restauración mensual, retención 30 días.</li>
                <li><strong>Certificaciones objetivo:</strong> ISO 27001, SOC 2 Type II, PCI-DSS (pasarelas).</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>10. Brechas de Seguridad (Ley 172-13 Art. 23, Ley 53-07)</h2>
            <ol class="legal-list-numbered">
                <li>Detección → Contención ≤ 1h; Evaluación impacto ≤ 24h.</li>
                <li>Notificación a INDOTEL y ProConsumidor ≤ 72h si riesgo alto para derechos.</li>
                <li>Notificación a titulares afectados ≤ 72h si riesgo alto para sus derechos (Art. 23 Ley 172-13).</li>
                <li>Registro interno de brechas (Art. 23 Reglamento 409-16).</li>
                <li>Plan de respuesta a incidentes (NIST 800-61) probado semestralmente.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>11. Cookies y Tecnologías Similares</h2>
            <table class="legal-table">
                <thead>
                    <tr><th>Tipo</th><th>Finalidad</th><th>Duración</th><th>Consentimiento</th></tr>
                </thead>
                <tbody>
                    <tr><td>Esenciales</td><td>Sesión, autenticación, seguridad, preferencias idioma, consentimiento cookies</td><td>Sesión / 1 año</td><td>No (Art. 8 Ley 172-13, interés legítimo)</td></tr>
                    <tr><td>Analítica</td><td>Uso agregado, rendimiento, UX (Mixpanel, PostHog, GA4 IP anonimizada)</td><td>13 meses</td><td>Sí (banner)</td></tr>
                    <tr><td>Marketing</td><td>Remarketing, personalización, campañas (solo si opt-in)</td><td>13 meses</td><td>Sí (banner)</td></tr>
                </tbody>
            </table>
            <p>Gestión: banner inicial + <a href="#" class="legal-link">Centro de Preferencias</a> en footer. Revocación en cualquier momento.</p>
        </section>

        <section class="legal-section">
            <h2>12. Datos de Menores de Edad</h2>
            <p>La Plataforma no está dirigida a menores de 18 años. No recabamos intencionadamente datos de menores. Si detectamos datos de menor sin consentimiento válido del tutor (Art. 12 Ley 172-13), los eliminamos inmediatamente. El Cliente (hotel) es responsable de obtener consentimiento parental para datos de menores huéspedes según Código para la Protección de Niños, Niñas y Adolescentes (Ley 136-03).</p>
        </section>

        <section class="legal-section">
            <h2>13. Decisiones Automatizadas y Perfilado</h2>
            <p>No realizamos decisiones exclusivamente automatizadas con efectos jurídicos significativos (Art. 18 Ley 172-13). Algoritmos de pricing dinámico, recomendación de habitaciones, o scoring de huéspedes son <strong>herramientas de apoyo</strong>; la decisión final la toma personal humano autorizado. Derecho a intervención humana, explicación y impugnación garantizado.</p>
        </section>

        <section class="legal-section">
            <h2>14. Encargados del Tratamiento y DPA</h2>
            <p>Todos los subprocesadores firman <strong>Data Processing Addendum (DPA)</strong> conforme Art. 11 Ley 172-13 y Reglamento 409-16, que incluye: objeto, duración, naturaleza, finalidad, categorías de datos, obligaciones seguridad, notificación brechas, auditoría, retorno/eliminación datos, subcontratación solo con autorización previa.</p>
        </section>

        <section class="legal-section">
            <h2>15. Transferencias Internacionales</h2>
            <p>Datos pueden procesarse en servidores ubicados en <strong>EE.UU. (AWS us-east-1, GCP us-central1)</strong> o <strong>Brasil (AWS sa-east-1)</strong>. Garantías:</p>
            <ul class="legal-list">
                <li>Cláusulas Contractuales Tipo (SCC) 2021/914 UE + addendum Ley 172-13.</li>
                <li>Evaluación de impacto transferencia (TIA) conforme Schrems II.</li>
                <li>Medidas suplementarias: cifrado en tránsito/reposo, claves controladas por Responsable, acceso solo personal autorizado, leyes destino no permiten acceso gubernamental masivo sin garantías.</li>
            </ul>
        </section>

        <section class="legal-section">
            <h2>16. Datos de Huéspedes y Empleados (Responsabilidad Compartida)</h2>
            <ol class="legal-list-numbered">
                <li>El Cliente (hotel) es <strong>Responsable del Tratamiento</strong> de datos de huéspedes y empleados.</li>
                <li>El Proveedor es <strong>Encargado del Tratamiento</strong>; solo procesa según instrucciones documentadas del Cliente.</li>
                <li>El Cliente garantiza: base legal válida, información a titulares (aviso privacidad), consentimiento donde requiera, derechos facilitados.</li>
                <li>El Proveedor asiste al Cliente en ejercicio de derechos de sus huéspedes/empleados (acceso, rectificación, supresión, portabilidad) ≤ 10 días hábiles.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>17. Cambios a esta Política</h2>
            <ol class="legal-list-numbered">
                <li>Actualizaciones publicadas en esta URL con versión y fecha.</li>
                <li>Cambios sustanciales: notificación email ≥ 30 días + banner en Plataforma.</li>
                <li>Cambios por obligación legal: aplicación inmediata, notificación posterior.</li>
                <li>Versiones anteriores accesibles en <a href="#" class="legal-link">historial de versiones</a>.</li>
            </ol>
        </section>

        <section class="legal-section">
            <h2>18. Contacto y Reclamaciones</h2>
            <p>Para ejercer derechos, consultas o reclamaciones:</p>
            <address>
                <strong>Hospitality OS, S.R.L. — Delegado de Protección de Datos (DPO)</strong><br>
                RNC: 1-31-XXXXX-X<br>
                Santo Domingo, Distrito Nacional, República Dominicana<br>
                Email: <a href="mailto:privacidad@hospitalityos.com" class="legal-link">privacidad@hospitalityos.com</a><br>
                Tel: +1 (809) XXX-XXXX<br>
                <br>
                <strong>Autoridad de Control:</strong> INDOTEL (Instituto Dominicano de las Telecomunicaciones)<br>
                Av. John F. Kennedy, Santo Domingo<br>
                Tel: +1 (809) 732-0000 | Web: <a href="https://www.indotel.gob.do" target="_blank" class="legal-link">indotel.gob.do</a>
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
            max-width: 900px;
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
        .legal-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 0.8125rem;
        }
        .legal-table th, .legal-table td {
            border: 1px solid var(--hos-border);
            padding: 0.625rem 0.875rem;
            text-align: left;
            vertical-align: top;
        }
        .legal-table th {
            background: var(--hos-bg);
            font-weight: 700;
            color: var(--hos-text);
        }
        .legal-table td {
            color: var(--hos-text);
        }
        address {
            font-style: normal;
            font-size: 0.9375rem;
            line-height: 1.7;
            color: var(--hos-text-muted);
        }
    `]
})
export class PrivacyComponent {}
