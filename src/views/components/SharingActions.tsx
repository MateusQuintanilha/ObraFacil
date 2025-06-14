import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Estimate } from '@/models/Estimate';
import { Client } from '@/models/Client';
import * as Clipboard from 'expo-clipboard';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import * as MediaLibrary from 'expo-media-library';

import { generateEstimateHtml } from '@/utils/generateEstimateHtml';
import { detailStyles as styles } from '@/views/styles/detailStyles';

type Props = {
  estimate: Estimate;
  client?: Client;
};

export const SharingActions: React.FC<Props> = ({ estimate, client }) => {
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const handleCopy = async () => {
    const items = estimate.items
      .map((item) => `• ${item.description} — ${item.quantity}x R$ ${item.value.toFixed(2).replace('.', ',')}`)
      .join('\n');

    const text = `
🧾 Orçamento
Cliente: ${client?.name}
Título: ${estimate.title}
Data: ${formatDate(estimate.createdAt)}
Validade: ${formatDate(estimate.validityDate)}
Status: ${estimate.status}

Descrição: ${estimate.description || 'Sem descrição'}

Itens:
${items}

Pagamento: ${
      estimate.payment.method === 'cash'
        ? 'Dinheiro'
        : estimate.payment.method === 'pix'
        ? 'Pix'
        : `Parcelado (${estimate.payment.installments}x)`
    }

Observações: ${estimate.notes || 'Nenhuma'}

💰 Total: ${formatCurrency(estimate.total)}
    `.trim();

    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado!', 'Dados do orçamento copiados para a área de transferência.');
  };

  const handleGeneratePDF = async () => {
    try {
      const html = generateEstimateHtml(estimate, client);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    }
  };

  const handlePreviewPDF = async () => {
    try {
      const html = generateEstimateHtml(estimate, client);
      const { uri } = await Print.printToFileAsync({ html });
      await WebBrowser.openBrowserAsync(uri);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível visualizar o PDF.');
    }
  };

  const handleSavePDF = async () => {
    try {
      const html = generateEstimateHtml(estimate, client);
      const { uri } = await Print.printToFileAsync({ html });

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('OrcamentosPDF', asset, false);
        Alert.alert('Sucesso', 'PDF salvo na galeria!');
      } else {
        Alert.alert('Permissão negada', 'Não foi possível salvar o PDF.');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o PDF.');
    }
  };

  return (
    <View style={styles.buttons}>
      <TouchableOpacity style={styles.button} onPress={handleCopy}>
        <Ionicons name="copy" size={20} color="#fff" />
        <Text style={styles.buttonText}>Copiar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGeneratePDF}>
        <Feather name="share" size={20} color="#fff" />
        <Text style={styles.buttonText}>Compartilhar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePreviewPDF}>
        <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
        <Text style={styles.buttonText}>Visualizar PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSavePDF}>
        <Ionicons name="download" size={20} color="#fff" />
        <Text style={styles.buttonText}>Salvar PDF</Text>
      </TouchableOpacity>
    </View>
  );
};
