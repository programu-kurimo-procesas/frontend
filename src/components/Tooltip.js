import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { theme } from '../core/theme';
const Tooltip = ({ onPress }) => {
  const [isVisible, setIsVisible] = useState(false);
  const opacity = React.useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    setIsVisible(!isVisible);
    // Animate opacity on state change
    Animated.timing(opacity, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (onPress) {
      onPress(handlePress); // Call onPress prop function with handlePress
    }
  }, [onPress]);

  return (
    <Animated.View style={[styles.rectangle, { opacity }]}>
      <Text>
        NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUIIIIIIIIIIIIII
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  rectangle: {
    width: 50,
    height: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    position: 'absolute', // Adjust positioning as needed
    top: 30, // Adjust position based on your button
    left: 10, // Adjust position based on your button
  },
});

export default Tooltip;