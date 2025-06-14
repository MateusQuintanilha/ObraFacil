import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEstimate } from '@/context/EstimateContext';
import { EstimatesStackParamList } from '@/navigation/tabs/EstimatesStack';
import { detailStyles as styles } from '@/views/styles/detailStyles';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { formatDateTime } from '@/utils/format';
import { formatDatePtBR } from '@/utils/formatDate';
import { useClient } from '@/context/ClientContext';
import { formatPhoneNumber } from '@/utils/formatPhone';
import { getEstimateStatusLabel, EstimateStatusColors } from '@/utils/status';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import * as Clipboard from 'expo-clipboard';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { generateEstimateHtml } from '@/utils/generateEstimateHtml';
import ShareSection from '@/views/components/ShareSection';

type Props = NativeStackScreenProps<EstimatesStackParamList, 'EstimateDetails'>;

export default function EstimateDetailsScreen({ route }: Props) {
  const { params } = useRoute<RouteProp<EstimatesStackParamList, 'EstimateDetails'>>();
  const navigation = useNavigation<NativeStackNavigationProp<EstimatesStackParamList>>();

  const { estimates, loading, deleteEstimate } = useEstimate();
  const { clients } = useClient();

  const estimate = estimates.find((e) => e.id === params.estimateId);
  if (!estimate) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Orçamento não encontrado.</Text>
      </View>
    );
  }

  const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_');
  };

  const client = clients.find((c) => c.id === estimate.clientId);
  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Aguardando aprovação', color: '#4CAF50' },
    approved: { label: 'Aprovado', color: '#2196F3' },
    rejected: { label: 'Rejeitado', color: '#F44336' },
  };

  const {
    title,
    description,
    validityDate,
    status,
    items,
    extraFees,
    discount,
    clientMaterial,
    serviceTypes,
    showRefCost,
    payment,
    deadline,
    notes,
    total,
    createdAt,
    updatedAt,
  } = estimate;

  const handleDelete = () => {
    Alert.alert('Excluir', 'Deseja realmente excluir este orçamento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteEstimate(estimate.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleCopyToClipboard = async () => {
    const itemsText = estimate.items
      .map((item) => `  • ${item.description} — ${item.quantity}x R$ ${item.value.toFixed(2).replace('.', ',')}`)
      .join('\n');

    const extraFeesText = estimate.extraFees?.length
      ? estimate.extraFees
          .map((fee) => `  • ${fee.description} — R$ ${fee.value.toFixed(2).replace('.', ',')}`)
          .join('\n')
      : '  Nenhuma';

    const text = `
🧾 ORÇAMENTO

Cliente: ${client?.name}
Título: ${estimate.title}
Data: ${formatDatePtBR(estimate.createdAt)}
Validade: ${formatDatePtBR(estimate.validityDate)}
Status: ${statusMap[estimate.status].label}

📝 Descrição:
${estimate.description || '  Sem descrição'}

📦 Itens:
${itemsText || '  Nenhum item'}

💸 Custos adicionais:
${extraFeesText}

💳 Pagamento:
  ${
    estimate.payment.method === 'cash'
      ? 'Dinheiro'
      : estimate.payment.method === 'pix'
      ? 'Pix'
      : `Parcelado (${estimate.payment.installments}x)`
  }

💰 Total: ${formatCurrency(estimate.total)}
  `.trim();

    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado!', 'Dados do orçamento copiados para a área de transferência.');
  };

  const handleGeneratePDF = async () => {
    try {
      const html = generateEstimateHtml(estimate, client);
      const sanitizedTitle = sanitizeFileName(estimate.title);
      const fileName = `Orcamento_${sanitizedTitle}.pdf`;

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const newUri = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      await Sharing.shareAsync(newUri);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6FC' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
        <View style={styles.card}>
          {/* Seção: Informações do Orçamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações do Orçamento</Text>

            <View style={styles.infoRow}>
              <Ionicons name="document-text" size={18} color="#0D47A1" />
              <Text style={styles.label}>Título:</Text>
            </View>
            <Text style={styles.value}>{title || '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="reader" size={18} color="#0D47A1" />
              <Text style={styles.label}>Descrição:</Text>
            </View>
            <Text style={styles.value}>{description || '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color="#0D47A1" />
              <Text style={styles.label}>Validade:</Text>
            </View>
            <Text style={styles.value}>{validityDate ? formatDateTime(validityDate) : '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={18} color="#0D47A1" />
              <Text style={styles.label}>Status:</Text>
            </View>
            <Text style={[styles.status, { backgroundColor: EstimateStatusColors[status] || '#AAA', color: '#fff' }]}>
              {getEstimateStatusLabel(status)}
            </Text>
          </View>

          {/* Seção: Cliente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cliente</Text>

            <View style={styles.infoRow}>
              <Ionicons name="person" size={18} color="#0D47A1" />
              <Text style={styles.label}>Nome:</Text>
            </View>
            <Text style={styles.value}>{client?.name || 'Cliente não encontrado'}</Text>

            {client && (
              <>
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={18} color="#0D47A1" />
                  <Text style={styles.label}>Telefone:</Text>
                </View>
                <Text style={styles.value}>{client.phone ? formatPhoneNumber(client.phone) : 'Não informado'}</Text>

                <View style={styles.infoRow}>
                  <Ionicons name="mail" size={18} color="#0D47A1" />
                  <Text style={styles.label}>E-mail:</Text>
                </View>
                <Text style={styles.value}>{client.email || '-'}</Text>
              </>
            )}
          </View>

          {/* Seção: Serviços e Itens */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Serviços e Itens</Text>

            <View style={styles.infoRow}>
              <Ionicons name="construct" size={18} color="#0D47A1" />
              <Text style={styles.label}>Materiais por conta do Cliente:</Text>
            </View>
            <Text style={styles.value}>{clientMaterial ? 'Sim' : 'Não'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="list" size={18} color="#0D47A1" />
              <Text style={styles.label}>Tipos de Serviço:</Text>
            </View>
            <Text style={styles.value}>{serviceTypes?.join(', ') || '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="eye" size={18} color="#0D47A1" />
              <Text style={styles.label}>Mostrar Referência de Custo:</Text>
            </View>
            <Text style={styles.value}>{showRefCost ? 'Sim' : 'Não'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color="#0D47A1" />
              <Text style={styles.label}>Prazo (dias):</Text>
            </View>
            <Text style={styles.value}>{deadline?.durationDays || '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="cube" size={18} color="#0D47A1" />
              <Text style={styles.label}>Itens:</Text>
            </View>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <Text style={styles.value} key={index}>
                  • {item.description} — {item.quantity} x {formatCurrency(item.value)} ={' '}
                  {formatCurrency(item.quantity * item.value)}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>Nenhum item</Text>
            )}

            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={18} color="#0D47A1" />
              <Text style={styles.label}>Taxas Extras:</Text>
            </View>
            {extraFees && extraFees.length > 0 ? (
              extraFees.map((fee, index) => (
                <Text style={styles.value} key={index}>
                  • {fee.description}: {formatCurrency(fee.value)}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>Nenhuma taxa extra</Text>
            )}
          </View>

          {/* Seção: Pagamento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pagamento</Text>

            <View style={styles.infoRow}>
              <Ionicons name="cash" size={18} color="#0D47A1" />
              <Text style={styles.label}>Desconto:</Text>
            </View>
            <Text style={styles.value}>R$ {discount}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="wallet" size={18} color="#0D47A1" />
              <Text style={styles.label}>Forma de Pagamento:</Text>
            </View>
            <Text style={styles.value}>
              {payment?.method === 'installments' ? `Parcelado (${payment.installments}x)` : payment?.method || '-'}
            </Text>

            <View style={styles.infoRow}>
              <Ionicons name="document" size={18} color="#0D47A1" />
              <Text style={styles.label}>Notas:</Text>
            </View>
            <Text style={styles.value}>{notes || '-'}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={18} color="#0D47A1" />
              <Text style={styles.label}>Total:</Text>
            </View>
            <Text style={styles.value}>{formatCurrency(total)}</Text>
          </View>

          {/* Seção: Datas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datas</Text>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color="#0D47A1" />
              <Text style={styles.label}>Criado em:</Text>
            </View>
            <Text style={styles.value}>{formatDateTime(createdAt)}</Text>

            {updatedAt && (
              <>
                <View style={styles.infoRow}>
                  <Ionicons name="refresh" size={18} color="#0D47A1" />
                  <Text style={styles.label}>Atualizado em:</Text>
                </View>
                <Text style={styles.value}>{formatDateTime(updatedAt)}</Text>
              </>
            )}
          </View>
        </View>

        {/* Seção: Botões de Ação */}
        <View style={[styles.buttons, { paddingBottom: 24 }]}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#1976D2' }]}
            onPress={() => navigation.navigate('EditEstimate', { estimateId: estimate.id })}
          >
            <Feather name="edit" size={20} color="#fff" />
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#D32F2F' }]} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color="#fff" />
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>

          <ShareSection handleCopyToClipboard={handleCopyToClipboard} handleGeneratePDF={handleGeneratePDF} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
