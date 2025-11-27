import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  style?: TextStyle;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  style,
  numberOfLines,
}) => {
  return (
    <RNText
      style={[styles.base, styles[variant], style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: '#333',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
    color: '#666',
  },
});

