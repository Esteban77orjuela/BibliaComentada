// ============================================================
// BibliaPlus Pro — SettingsScreen
// Ajustes: buscar actualizaciones por OTA (expo-updates)
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Updates from 'expo-updates';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../constants/theme';

type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'upToDate'
  | 'available'
  | 'downloading'
  | 'restarting'
  | 'disabled'
  | 'error';

export default function SettingsScreen() {
  const [status, setStatus] = useState<UpdateStatus>('idle');

  const checkForUpdates = async () => {
    setStatus('checking');
    try {
      if (!Updates.isEnabled) {
        setStatus('disabled');
        return;
      }
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        setStatus('available');
      } else {
        setStatus('upToDate');
      }
    } catch (err) {
      if ((err as any)?.code === 'ERR_UPDATES_DISABLED' || !Updates.isEnabled) {
        setStatus('disabled');
      } else {
        setStatus('error');
      }
    }
  };

  const downloadAndRestart = async () => {
    setStatus('downloading');
    try {
      const fetchResult = await Updates.fetchUpdateAsync();
      if (fetchResult.isNew) {
        setStatus('restarting');
        await Updates.reloadAsync();
      } else {
        setStatus('upToDate');
      }
    } catch {
      setStatus('error');
    }
  };

  const busy = status === 'checking' || status === 'downloading' || status === 'restarting';

  const statusLabel: Record<UpdateStatus, string> = {
    idle: 'Revisa si hay novedades publicadas para BibliaPlus.',
    checking: 'Buscando actualizaciones...',
    upToDate: 'Estás al día. BibliaPlus está actualizada.',
    available: 'Hay una actualización disponible. Descárgala y se aplicará al reiniciar.',
    downloading: 'Descargando actualización...',
    restarting: 'Aplicando actualización, reiniciando la app...',
    disabled:
      'Esta opción solo está disponible en la versión instalada de la app, no en Expo Go ni en modo desarrollo.',
    error: 'No se pudo comprobar. Revisa tu conexión e inténtalo de nuevo.',
  };

  const createdAt = Updates.createdAt
    ? Updates.createdAt.toLocaleDateString()
    : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Actualización ── */}
      <Text style={styles.sectionTitle}>Actualización</Text>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBg}>
            <UpdateIcon />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>Buscar actualizaciones</Text>
            <Text style={styles.cardSubtitle}>Mantén BibliaPlus al día por OTA</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          {busy ? (
            <ActivityIndicator size="small" color={Colors.accent} />
          ) : (
            <View style={[styles.statusDot, status === 'upToDate' && styles.statusDotOk]} />
          )}
          <Text style={styles.statusText}>{statusLabel[status]}</Text>
        </View>

        {status === 'available' ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={downloadAndRestart}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Descargar y reiniciar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryButton, busy && styles.primaryButtonDisabled]}
            onPress={checkForUpdates}
            disabled={busy}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>
              {busy ? 'Espera...' : 'Buscar actualizaciones'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Información ── */}
      <Text style={styles.sectionTitle}>Información</Text>
      <View style={styles.card}>
        <InfoRow label="Versión" value={Updates.runtimeVersion ?? '—'} />
        <InfoRow label="Canal" value={Updates.channel ?? '—'} />
        <InfoRow label="Actualización actual" value={createdAt ?? 'Integrada en la app'} last />
      </View>
    </ScrollView>
  );
}

function UpdateIcon() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2.5, borderColor: Colors.accent }} />
      <View style={{ position: 'absolute', width: 2.5, height: 8, backgroundColor: Colors.accent, borderRadius: 1.5, marginTop: -2 }} />
      <View style={styles.chevronLeft} />
      <View style={styles.chevronRight} />
    </View>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    marginBottom: Spacing.base,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.base,
    minHeight: 44,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  statusDotOk: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    flex: 1,
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: Typography.sans.bold,
    fontSize: FontSizes.base,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  infoValue: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    flexShrink: 1,
    marginLeft: Spacing.md,
    textAlign: 'right',
  },
  chevronLeft: {
    position: 'absolute',
    bottom: 1,
    left: 2,
    width: 6,
    height: 2.5,
    backgroundColor: Colors.accent,
    borderRadius: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  chevronRight: {
    position: 'absolute',
    bottom: 1,
    right: 2,
    width: 6,
    height: 2.5,
    backgroundColor: Colors.accent,
    borderRadius: 1.5,
    transform: [{ rotate: '-45deg' }],
  },
});
