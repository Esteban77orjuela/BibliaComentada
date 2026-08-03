// ============================================================
// BibliaPlus Pro — TabNavigator  (Redesign 2026)
// Tab bar tipo "píldora" oscura flotante, totalmente personalizada
// para control absoluto del centrado y el contenido
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types';
import { Colors, Typography, FontSizes, Spacing, Shadows } from '../constants/theme';
import BibleStack from './BibleStack';
import DictionaryStack from './DictionaryStack';
import ArticlesStack from './ArticlesStack';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

// ── Íconos SVG minimalistas con View ──

function LibraryIconSVG({ focused }: { focused: boolean }) {
  const color = focused ? Colors.tabActive : Colors.tabInactive;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2.5 }}>
      {[11, 16, 13, 15, 10].map((h, i) => (
        <View
          key={i}
          style={{
            width: 3.5,
            height: h,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
}

function SearchIconSVG({ focused }: { focused: boolean }) {
  const color = focused ? Colors.tabActive : Colors.tabInactive;
  return (
    <View>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 2.5,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          width: 7,
          height: 2.5,
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

function BookmarkIconSVG({ focused }: { focused: boolean }) {
  const color = focused ? Colors.tabActive : Colors.tabInactive;
  return (
    <View
      style={{
        width: 14,
        height: 19,
        borderWidth: 2.5,
        borderColor: color,
        borderRadius: 2,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 7,
          borderRightWidth: 7,
          borderTopWidth: 6,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: Colors.tabBarBg,
        }}
      />
    </View>
  );
}

function DictIconSVG({ focused }: { focused: boolean }) {
  const color = focused ? Colors.tabActive : Colors.tabInactive;
  return (
    <View style={{ gap: 3 }}>
      {[14, 10, 12].map((w, i) => (
        <View
          key={i}
          style={{
            width: w,
            height: 2.5,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
}

function ArticlesIconSVG({ focused }: { focused: boolean }) {
  const color = focused ? Colors.tabActive : Colors.tabInactive;
  return (
    <View style={{ gap: 2.5 }}>
      <View style={{ width: 16, height: 2.5, backgroundColor: color, borderRadius: 2 }} />
      <View style={{ width: 12, height: 2.5, backgroundColor: color, borderRadius: 2 }} />
      <View style={{ width: 16, height: 2.5, backgroundColor: color, borderRadius: 2 }} />
      <View style={{ width: 9, height: 2.5, backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
}

// ── Tab Bar personalizada ──

const TAB_LABELS: Record<string, string> = {
  BibleTab: 'Inicio',
  SearchTab: 'Buscar',
  FavoritesTab: 'Guardados',
  DictionariesTab: 'Diccionario',
  ArticlesTab: 'Artículos',
};

const TAB_ICONS: Record<string, (focused: boolean) => React.ReactNode> = {
  BibleTab: (focused) => <LibraryIconSVG focused={focused} />,
  SearchTab: (focused) => <SearchIconSVG focused={focused} />,
  FavoritesTab: (focused) => <BookmarkIconSVG focused={focused} />,
  DictionariesTab: (focused) => <DictIconSVG focused={focused} />,
  ArticlesTab: (focused) => <ArticlesIconSVG focused={focused} />,
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.barWrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}
      pointerEvents="box-none"
    >
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            (typeof options.tabBarLabel === 'string' ? options.tabBarLabel : null) ??
            TAB_LABELS[route.name] ??
            '';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrap}>
                {TAB_ICONS[route.name](focused)}
              </View>
              <Text
                style={[styles.tabLabel, focused && styles.tabLabelActive]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="BibleTab" component={BibleStack} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ tabBarLabel: 'Buscar' }} />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{ tabBarLabel: 'Guardados' }}
      />
      <Tab.Screen
        name="DictionariesTab"
        component={DictionaryStack}
        options={{ tabBarLabel: 'Diccionario' }}
      />
      <Tab.Screen
        name="ArticlesTab"
        component={ArticlesStack}
        options={{ tabBarLabel: 'Artículos' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: 62,
    backgroundColor: Colors.tabBarBg,
    borderRadius: 31,
    overflow: 'hidden',
    ...Shadows.dark,
    elevation: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 36,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: 10,
    color: Colors.tabInactive,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.tabActive,
    fontFamily: Typography.sans.semiBold,
  },
});
