import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1',
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: '#EAEEEF',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },

  value: {
    fontSize: 14,
    color: '#333',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 12,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#0D47A1',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 4,
  },

  estimateTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },

  info: {
    color: '#555',
  },

  clientItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  clientInfo: {
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    backgroundColor: '#0D47A1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fabText: {
    fontSize: 28,
    color: 'white',
    lineHeight: 32,
  },

  statusBase: {
    alignSelf: 'flex-start',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
    overflow: 'hidden',
    color: '#fff'
  },

  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
