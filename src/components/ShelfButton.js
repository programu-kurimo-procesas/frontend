
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../core/theme';
const ShelfButton = ({ button, onPress }) => {
    const { x1, y1, x2, y2, ...otherProps } = button; // Extract button properties
  
    const styles = StyleSheet.create({
        mapButton: {
            position: 'absolute', // Ens
            backgroundColor: theme.colors.primary,
            borderWidth: 2,
            borderRadius: 2,
            borderColor: theme.colors.primary
        },
    });
  
    return (
      <TouchableOpacity
        key={button.id}
        style={[styles.mapButton, { // Apply styles and button data positioning
          marginLeft: parseInt(x1),
          marginTop: parseInt(y1),
          width: parseInt(x2) - parseInt(x1),
          height: parseInt(y2) - parseInt(y1),
        }, otherProps]} // Pass remaining button props
        onPress={(event) => onPress(event, button.id)}
      >
        {/* Add content here if needed, like text or icons */}
      </TouchableOpacity>
    );
  };
  
  export default ShelfButton;