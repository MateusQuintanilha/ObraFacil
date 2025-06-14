import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  title: {
    fontSize: 24,
    color: '#0D47A1',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#0D47A1',
  },

  // input: {
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  //   borderRadius: 6,
  //   padding: 10,
  //   fontSize: 16,
  //   backgroundColor: '#f9f9f9',
  //   marginBottom: 6,
  // },

  // inputFocused: {
  //   borderColor: '#0D47A1',
  //   backgroundColor: '#fff',
  // },

  inputTextArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 10,
    marginTop: 5,
    marginBottom: 6,
    height: 80,
    textAlignVertical: 'top',
  },

  saveButton: {
    backgroundColor: '#0D47A1',
    padding: 14,
    borderRadius: 6,
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // deleteButton: {
  //   backgroundColor: '#d32f2f',
  //   padding: 8,
  //   borderRadius: 4,
  //   alignSelf: 'flex-end',
  //   marginTop: 6,
  // },

  addButton: {
    flexDirection: 'row',
    backgroundColor: '#388E3C',
    padding: 12,
    justifyContent: 'center',
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },

  alert: {
    color: '#ff0000',
    fontWeight: 'bold',
    marginBottom: 6,
  },

  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#0D47A1',
  },

  value: {
    fontSize: 16,
    marginBottom: 6,
  },

  selectButton: {
    padding: 10,
    backgroundColor: '#eee',
    marginBottom: 6,
    borderRadius: 6,
  },

  selected: {
    backgroundColor: '#0D47A1',
    color: '#fff',
  },

  itemCard: {
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 6,
  },

  dropdownList: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    maxHeight: 150,
  },


  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  dropdownItemLast: {
    borderBottomWidth: 0,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#ccc',
  },

  addressSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  section: {},

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  // Estilo para o Switch
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },

  switchText: {
    flex: 1,
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
  },

  totalValue: {
    fontSize: 18,
    color: '#2E7D32',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Novos estilos para EstimateCreateScreen:

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },

  paymentMethodButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0D47A1',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  paymentMethodSelected: {
    backgroundColor: '#0D47A1',
  },

  paymentMethodSelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  paymentMethodButtonText: {
    color: '#0D47A1',
    fontWeight: 'bold',
  },

  smallLabel: {
    fontSize: 12,
    color: '#444',
    marginBottom: 2,
  },

  // Novos estilos para inputs com foco
  inputFocus: {
    borderColor: '#0D47A1',
  },

  inputTextAreaFocus: {
    borderColor: '#0D47A1',
    backgroundColor: '#fff',
  },

  inputError: {
    borderColor: '#d32f2f',
  },

  // Estilos para os campos de entrada
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 6,
  },

  inputFocused: {
    borderColor: '#0D47A1',
    backgroundColor: '#fff',
  },

  // Estilo do botão de apagar
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  totalContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'flex-end',
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  dateInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    justifyContent: 'center',
  },
});
