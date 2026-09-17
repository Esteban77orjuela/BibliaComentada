import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Translation } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';

interface TranslationSwitcherProps {
  translations: Translation[];
  currentTranslationId: number;
  onSelect: (translationId: number) => void;
}

export default function TranslationSwitcher({
  translations,
  currentTranslationId,
  onSelect,
}: TranslationSwitcherProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [visible, setVisible] = useState(false);

  const current =
    translations.find(t => t.id === currentTranslationId) ?? translations[0];

  const handleSelect = (id: number) => {
    onSelect(id);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.trigger}
        activeOpacity={0.8}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {current?.code ?? 'Traducción'}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Traducción de la Biblia</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {translations.map(t => {
              const selected = t.id === currentTranslationId;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => handleSelect(t.id)}
                  style={[styles.option, selected && styles.optionSelected]}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionInfo}>
                    <Text style={[
                      styles.optionName,
                      selected && styles.optionNameSelected,
                    ]}>
                      {t.fullName || t.name}
                    </Text>
                    <Text style={styles.optionCredits}>{t.copyright}</Text>
                  </View>
                  {selected && <View style={styles.check} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: Radius.md,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    triggerText: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.base,
      color: colors.textPrimary,
      maxWidth: 90,
    },
    chevron: {
      marginLeft: Spacing.xs,
      fontSize: FontSizes.sm,
      color: colors.textMuted,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
    },
    modalContent: {
      flex: 1,
      backgroundColor: colors.surfaceElevated,
      marginTop: 60,
      borderTopLeftRadius: Radius['2xl'],
      borderTopRightRadius: Radius['2xl'],
      ...Shadows.dark,
      paddingTop: Spacing.xs,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: Spacing.xs,
    },
    modalTitle: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.md,
      color: colors.textPrimary,
    },
    closeButton: {
      fontSize: 20,
      color: colors.textMuted,
      padding: Spacing.xs,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      backgroundColor: colors.surfaceElevated,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionSelected: {
      backgroundColor: colors.accentLight,
    },
    optionInfo: {
      flex: 1,
      marginRight: Spacing.base,
    },
    optionName: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.base,
      color: colors.textPrimary,
    },
    optionNameSelected: {
      color: colors.accent,
    },
    optionCredits: {
      fontFamily: Typography.sans.regular,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      marginTop: 2,
    },
    check: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    },
  });