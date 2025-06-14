import { StyleSheet } from 'react-native';

export const detailStyles = StyleSheet.create({
  // Layout e containers
  container: {
    flex: 1,
    backgroundColor: '#F4F6FC',
    padding: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cartão principal
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingLeft: 20,
    paddingTop: 4,
    paddingRight: 20,
    paddingBottom: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },

  // Título e seções
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0D47A1',
  },
  section: {
    marginTop: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    color: '#444',
  },

  // Informações e texto
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    color: '#555',
    marginLeft: 24,
    marginTop: 4,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 32,
  },

  // Status
  status: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 6,
    marginLeft: 24,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Botões
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 28,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#388E3C', // #0D47A1, '#388E3C'
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },

  // Listagem e itens
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    lineHeight: 20,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  bulletItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  itemRow: {
    marginBottom: 8,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 15,
  },

  // Total
  total: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 22,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
});
