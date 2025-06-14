import { captureRef } from 'react-native-view-shot';
import * as Clipboard from 'expo-clipboard';
import Share from 'react-native-share';
import { Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export const shareEstimateAsImage = async (viewRef: any) => {
  try {
    const uri = await captureRef(viewRef, { format: 'png', quality: 1 });
    await Share.open({ url: uri, type: 'image/png' });
  } catch (error) {
    Alert.alert('Erro', 'Falha ao compartilhar como imagem.');
  }
};

export const copyEstimateToClipboard = (estimate: any, client: any) => {
  const text = `
Orçamento Nº ${estimate.id}
Cliente: ${client.name}
Telefone: ${client.phone}
E-mail: ${client.email}
Total: ${estimate.total}
Descrição: ${estimate.description || '-'}
  `;
  Clipboard.setStringAsync(text.trim());
  Alert.alert('Copiado', 'Conteúdo copiado para a área de transferência.');
};

export const generateEstimatePDF = async (estimate: any, client: any) => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 24px; }
          h1 { color: #455A64; }
          p { margin: 8px 0; }
        </style>
      </head>
      <body>
        <h1>Orçamento Nº ${estimate.id}</h1>
        <p><strong>Cliente:</strong> ${client.name}</p>
        <p><strong>Telefone:</strong> ${client.phone}</p>
        <p><strong>Email:</strong> ${client.email}</p>
        <p><strong>Total:</strong> R$ ${estimate.total}</p>
        <p><strong>Descrição:</strong> ${estimate.description || '-'}</p>
        <p><strong>Criado em:</strong> ${new Date(estimate.createdAt).toLocaleString()}</p>
      </body>
    </html>
  `;

  try {
    const { filePath } = await RNHTMLtoPDF.convert({
      html: htmlContent,
      fileName: `orcamento-${estimate.id}`,
      base64: false,
    });

    await Share.open({ url: `file://${filePath}`, type: 'application/pdf' });
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível gerar o PDF.');
  }
};
