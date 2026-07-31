// ============================================================
// BibliaPlus Pro — SearchBar Component
// Barra de búsqueda con debounce integrado
// ============================================================

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Buscar versículos, comentarios…',
  debounceMs = 300,
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch(text);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleClear = () => {
    setValue('');
    if (timerRef.current) clearTimeout(timerRef.current);
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn} hitSlop={8}>
          <View style={styles.clearCircle}>
            <Text style={styles.clearIcon}>✕</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 46,
    ...Shadows.sm,
  },
  icon: {
    fontSize: 15,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    padding: 0,
  },
  clearBtn: {
    marginLeft: Spacing.sm,
  },
  clearCircle: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 10,
    color: Colors.surfaceElevated,
    fontWeight: '700',
  },
});
