import { Estimate } from '@/models/Estimate';
import { Client } from '@/models/Client';
import { formatCurrency, formatDate } from './format';

const statusMap = {
  pending: { label: 'Aguardando aprovação' },
  approved: { label: 'Aprovado' },
  rejected: { label: 'Rejeitado' },
  expired: { label: 'Vencido' },
};

export function generateEstimateHtml(estimate: Estimate, client?: Client): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <style>
      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
      }

      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        color: #333;
        line-height: 1.6;
        position: relative;
        min-height: 100%;
      }

      h1, h2 {
        color: #00695C;
        margin: 0 0 8px;
      }

      p {
        margin: 2px 0;
      }

      .header {
        text-align: center;
        margin-bottom: 24px;
      }

      .header h1 {
        font-size: 26px;
        text-transform: uppercase;
      }

      .section {
        margin-bottom: 16px;
      }

      .label {
        font-weight: bold;
        color: #444;
        margin-right: 4px;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8px;
      }

      .table th, .table td {
        border: 1px solid #bbb;
        padding: 8px;
        text-align: left;
        vertical-align: top;
      }

      .table th {
        background-color: #f0f0f0;
        font-weight: bold;
      }

      .total {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        margin-top: 30px;
      }

      .signature {
        margin-top: 60px;
        display: flex;
        justify-content: flex-end;
      }

      .signature-line {
        margin-top: 40px;
        border-top: 1px solid #ccc;
        width: 200px;
        text-align: center;
        font-size: 12px;
        color: #777;
      }

      .footer {
        position: absolute;
        bottom: 40px;
        left: 40px;
        right: 40px;
        font-size: 14px;
        text-align: center;
      }

      .highlight {
        color: #00695C;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>ObraFácil - Orçamento</h1>
      <p>Data: ${formatDate(estimate.createdAt)} | Validade: ${formatDate(estimate.validityDate)}</p>
    </div>

    <div class="section">
      <p><span class="label">Cliente:</span> ${client?.name || 'N/A'}</p>
      <p><span class="label">Título:</span> ${estimate.title}</p>
      <p><span class="label">Status:</span> ${statusMap[estimate.status]?.label || 'Desconhecido'}</p>
    </div>

    <div class="section">
      <p><span class="label">Descrição:</span> ${estimate.description || 'Sem descrição'}</p>
    </div>

    ${estimate.clientMaterial ? `
    <div class="section">
      <p><span class="label">Cliente fornecerá os materiais.</span></p>
    </div>` : ''}

    ${estimate.serviceTypes.length > 0 ? `
    <div class="section">
      <p><span class="label">Tipos de Serviço:</span> ${estimate.serviceTypes.join(', ')}</p>
    </div>` : ''}

    <div class="section">
      <p><span class="label">Forma de Pagamento:</span>
        ${estimate.payment.method === 'cash'
      ? 'Dinheiro'
      : estimate.payment.method === 'pix'
        ? 'Pix'
        : `Parcelado (${estimate.payment.installments}x)`}
      </p>
    </div>

    ${estimate.showRefCost ? `
    <div class="section">
      <p><span class="label">Valor de referência exibido ao cliente.</span></p>
    </div>` : ''}

    ${estimate.discount ? `
    <div class="section">
      <p><span class="label">Desconto:</span> ${formatCurrency(estimate.discount)}</p>
    </div>` : ''}

    <div class="section">
      <h2>Itens</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${estimate.items.map((item) => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrency(item.value)}</td>
              <td>${formatCurrency(item.value * item.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${estimate.extraFees?.length ? `
    <div class="section">
      <h2>Custos adicionais</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          ${estimate.extraFees.map((fee) => `
            <tr>
              <td>${fee.description}</td>
              <td>${formatCurrency(fee.value)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>` : ''}

    <div class="total">
      Total: ${formatCurrency(estimate.total)}
    </div>

    <div class="signature">
      <div class="signature-line">Assinatura do Responsável</div>
    </div>

    <div class="footer">
      <p>Este orçamento foi gerado em ${formatDate(estimate.createdAt)} e é válido até ${formatDate(estimate.validityDate)}.</p>
    </div>
  </body>
</html>
`;
}
