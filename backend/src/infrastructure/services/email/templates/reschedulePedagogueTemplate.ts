import { RescheduledPedagogueEmailData } from "@domain/services/interfaces/reschedulePedagogueData";

export function buildRescheduledPedagogueTemplate(data: RescheduledPedagogueEmailData, dashboardLink: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f0ede6;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ede6;padding:40px 20px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Logo -->
      <tr><td align="center" style="padding-bottom:24px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;padding-right:10px;">
            <div style="width:48px;height:48px;border-radius:50%;background:#ffffff;border:2px solid #4ecba4;display:inline-block;text-align:center;line-height:48px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;">
                <path d="M12 3L22 8L12 13L2 8L12 3Z" stroke="#4ecba4" stroke-width="1.8" stroke-linejoin="round"/>
                <path d="M7 10.5V16C7 16 9 18 12 18C15 18 17 16 17 16V10.5" stroke="#4ecba4" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="22" y1="8" x2="22" y2="14" stroke="#4ecba4" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </div>
          </td>
          <td style="vertical-align:middle;">
            <span style="font-size:18px;font-weight:bold;color:#1a1a1a;">SAP<span style="color:#4ecba4;">ICOMP</span></span><br/>
            <span style="font-size:10px;color:#888888;letter-spacing:0.5px;text-transform:uppercase;">Serviço de Apoio Pedagógico</span>
          </td>
        </tr></table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background-color:#ffffff;border-radius:16px;border:1px solid #d8d4cc;">

        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background-color:#085041;padding:24px 28px;border-radius:16px 16px 0 0;">
            <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:bold;color:rgba(255,255,255,0.8);letter-spacing:0.4px;text-transform:uppercase;margin-bottom:8px;">Agendamento remarcado</div>
            <div style="font-size:20px;font-weight:bold;color:#ffffff;">Um atendimento foi remarcado</div>
          </td></tr>
        </table>

        <!-- Corpo -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:28px;">

            <p style="margin:0 0 4px;font-size:12px;color:#888888;">Olá,</p>
            <p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#1a1a1a;">${data.pedagogueName}</p>

            <p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.7;">
              Um aluno remarcou um atendimento em sua agenda no <strong style="color:#1a1a1a;">SAP-IComp</strong>. O horário anterior foi liberado e o novo aguarda sua confirmação.
            </p>

            <!-- Dados do aluno -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
              <tr><td style="background-color:#f7f5f0;border-radius:10px;border:1px solid #d8d4cc;padding:16px 18px;">
                <p style="margin:0 0 12px;font-size:11px;font-weight:bold;color:#888888;text-transform:uppercase;letter-spacing:0.5px;">Dados do aluno</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                  <tr>
                    <td style="color:#888888;padding:5px 0;width:44%;">Nome</td>
                    <td style="color:#1a1a1a;font-weight:500;padding:5px 0;">${data.studentName}</td>
                  </tr>
                  <tr>
                    <td style="color:#888888;padding:5px 0;border-top:1px solid #e8e4dc;">Matrícula</td>
                    <td style="color:#1a1a1a;font-weight:500;padding:5px 0;border-top:1px solid #e8e4dc;">${data.enrollment}</td>
                  </tr>
                  <tr>
                    <td style="color:#888888;padding:5px 0;border-top:1px solid #e8e4dc;">Curso</td>
                    <td style="color:#1a1a1a;font-weight:500;padding:5px 0;border-top:1px solid #e8e4dc;">${data.course}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Horário anterior -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr><td style="background-color:#fdf2f2;border-radius:10px;border:1px solid #f5c4b3;padding:14px 18px;">
                <p style="margin:0 0 10px;font-size:11px;font-weight:bold;color:#c0392b;text-transform:uppercase;letter-spacing:0.5px;">Horário liberado</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                  <tr>
                    <td style="color:#888888;padding:4px 0;width:44%;">Data</td>
                    <td style="color:#aaaaaa;padding:4px 0;text-decoration:line-through;">${data.previousDate}</td>
                  </tr>
                  <tr>
                    <td style="color:#888888;padding:4px 0;border-top:1px solid #f5c4b3;">Horário</td>
                    <td style="color:#aaaaaa;padding:4px 0;border-top:1px solid #f5c4b3;text-decoration:line-through;">${data.previousStartTime} &#8212; ${data.previousEndTime}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Seta -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr><td align="center" style="font-size:20px;color:#d97706;padding:6px 0;">&#8595;</td></tr>
            </table>

            <!-- Novo horário -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr><td style="background-color:#f0f9f6;border-radius:10px;border:1px solid #a0ddc5;padding:14px 18px;">
                <p style="margin:0 0 10px;font-size:11px;font-weight:bold;color:#085041;text-transform:uppercase;letter-spacing:0.5px;">Novo horário solicitado</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                  <tr>
                    <td style="color:#888888;padding:4px 0;width:44%;">Data</td>
                    <td style="color:#085041;font-weight:bold;padding:4px 0;">${data.newDate}</td>
                  </tr>
                  <tr>
                    <td style="color:#888888;padding:4px 0;border-top:1px solid #a0ddc5;">Horário</td>
                    <td style="color:#085041;font-weight:bold;padding:4px 0;border-top:1px solid #a0ddc5;">${data.newStartTime} &#8212; ${data.newEndTime}</td>
                  </tr>
                  <tr>
                    <td style="color:#888888;padding:4px 0;border-top:1px solid #a0ddc5;">Duração</td>
                    <td style="color:#085041;font-weight:bold;padding:4px 0;border-top:1px solid #a0ddc5;">${data.duration}</td>
                  </tr>
                  <tr>
                    <td style="color:#888888;padding:4px 0;border-top:1px solid #a0ddc5;">Motivo</td>
                    <td style="color:#085041;font-weight:bold;padding:4px 0;border-top:1px solid #a0ddc5;">${data.reason}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr><td align="center">
                <a href="${dashboardLink}"
                   style="display:inline-block;background:#085041;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;padding:11px 28px;border-radius:7px;">
                  Acessar painel e confirmar
                </a>
              </td></tr>
            </table>

            <!-- Aviso -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="background-color:#f0f9f6;border:1px solid #a0ddc5;border-radius:8px;padding:11px 14px;">
                <p style="margin:0;font-size:12px;color:#085041;line-height:1.6;">
                  O horário anterior foi liberado. O novo horário está bloqueado e aguarda sua confirmação no sistema.
                </p>
              </td></tr>
            </table>

          </td></tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="border-top:1px solid #e8e4dc;padding:14px 28px;background-color:#faf9f6;border-radius:0 0 16px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:11px;color:#aaaaaa;">Instituto de Computação — UFAM</td>
              <td align="right" style="font-size:12px;font-weight:bold;color:#4ecba4;">SAP<span style="color:#555555;">ICOMP</span></td>
            </tr></table>
          </td></tr>
        </table>

      </td></tr>
      <tr><td align="center" style="padding-top:16px;">
        <p style="margin:0;font-size:11px;color:#aaaaaa;">Este é um e-mail automático. Por favor, não responda.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
  `;
}
