import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ShareSectionProps = {
  handleCopyToClipboard: () => void;
  handleGeneratePDF: () => void;
};

export default function ShareSection({ handleCopyToClipboard, handleGeneratePDF }: ShareSectionProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible((prev) => !prev);
  const closeMenu = () => setMenuVisible(false);

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#455A64' }]} onPress={toggleMenu}>
          <Feather name="share-2" size={20} color="#fff" />
          <Text style={styles.buttonText}>Compartilhar</Text>
        </TouchableOpacity>

        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: '#00897B' }]}
              onPress={() => {
                handleCopyToClipboard();
                closeMenu();
              }}
            >
              <Feather name="copy" size={20} color="#fff" />
              <Text style={styles.buttonText}>Copiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: '#6A1B9A' }]}
              onPress={() => {
                handleGeneratePDF();
                closeMenu();
              }}
            >
              <Feather name="file-text" size={20} color="#fff" />
              <Text style={styles.buttonText}>Gerar PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menu: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
