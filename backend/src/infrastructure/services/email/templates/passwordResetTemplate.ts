import { PasswordResetEmailData } from "@domain/services/interfaces/passwordResetEmail";

export function buildPasswordResetTemplate(data: PasswordResetEmailData): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f0ede6;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0ede6;padding:40px 20px;">
    <tr>
        <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

            <!-- Logo -->
            <tr>
            <td align="center" style="padding-bottom:24px;">
                <img src="cid:logo" alt="SAP iComp Logo" style="width: 200px; height: auto;" />
            </td>
            </tr>

            <!-- Card -->
            <tr>
            <td style="background-color:#ffffff;border-radius:16px;border:1px solid #d8d4cc;">

                <!-- Header verde -->
                <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="background-color:#4ecba4;padding:28px 32px 24px;border-radius:16px 16px 0 0;">
                    <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.85);font-weight:bold;letter-spacing:0.3px;text-transform:uppercase;">Redefinição de senha</p>
                    <span style="font-size:22px;font-weight:bold;color:#ffffff;">Recuperação de acesso</span>
                    </td>
                </tr>
                </table>

                <!-- Body -->
                <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:32px;">

                    <p style="margin:0 0 4px;font-size:13px;color:#888888;">Olá,</p>
                    <p style="margin:0 0 20px;font-size:16px;font-weight:bold;color:#1a1a1a;">${data.name}</p>

                    <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.7;">
                        Recebemos uma solicitação para redefinir a senha da sua conta no <strong style="color:#1a1a1a;">SAP ICOMP</strong>. Clique no botão abaixo para criar uma nova senha.
                    </p>

                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                        <tr>
                        <td align="center">
                            <a href="${data.resetUrl}"
                            style="display:inline-block;background-color:#4ecba4;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;padding:13px 36px;border-radius:8px;">
                            Redefinir minha senha
                            </a>
                        </td>
                        </tr>
                    </table>

                    <!-- Alternative Link -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                        <tr>
                        <td style="background-color:#f7f5f0;border-radius:8px;border:1px solid #d8d4cc;padding:14px 16px;">
                            <p style="margin:0 0 6px;font-size:12px;color:#888888;text-transform:uppercase;letter-spacing:0.4px;">Ou cole o link no navegador</p>
                            <p style="margin:0;font-size:12px;color:#4ecba4;word-break:break-all;font-family:Courier New,monospace;">${data.resetUrl}</p>
                        </td>
                        </tr>
                    </table>

                    <!-- Expiration -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                        <tr>
                        <td style="background-color:#fff8e8;border:1px solid #f0d080;border-radius:8px;padding:12px 14px;">
                            <p style="margin:0;font-size:13px;color:#8a6200;line-height:1.6;">
                            ⏱ Este link expira em <strong>1 hora</strong> após o envio deste e-mail.
                            </p>
                        </td>
                        </tr>
                    </table>

                    <!-- Safety -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="background-color:#f0f9f6;border:1px solid #a0ddc5;border-radius:8px;padding:12px 14px;">
                            <p style="margin:0;font-size:13px;color:#0f6e56;line-height:1.6;">
                            🔒 Se você não solicitou esta alteração, ignore este e-mail. Sua senha permanece a mesma.
                            </p>
                        </td>
                        </tr>
                    </table>

                    </td>
                </tr>
                </table>

                <!-- Card's Footer -->
                <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="border-top:1px solid #e8e4dc;padding:18px 32px;background-color:#faf9f6;border-radius:0 0 16px 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td style="font-size:12px;color:#aaaaaa;">Instituto de Computação — UFAM</td>
                        <td align="right" style="font-size:13px;font-weight:bold;color:#4ecba4;">SAP <span style="color:#555555;">ICOMP</span></td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>

            </td>
            </tr>

            <!-- Bottom -->
            <tr>
            <td align="center" style="padding-top:20px;">
                <p style="margin:0;font-size:11px;color:#aaaaaa;">Este é um e-mail automático. Por favor, não responda.</p>
            </td>
            </tr>

        </table>
        </td>
    </tr>
    </table>
</body>
</html>
    `;
}
