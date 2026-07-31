import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types';
import { Colors, Typography, FontSizes } from '../constants/theme';
import BibleStack from './BibleStack';
import DictionaryStack from './DictionaryStack';
import ArticlesStack from './ArticlesStack';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Text style={styles.iconEmoji}>{emoji}</Text>
    </View>
  );
}

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="BibleTab"
        component={BibleStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <TabIcon emoji="📖" focused={focused} />
              <TabLabel label="Biblia" focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="DictionariesTab"
        component={DictionaryStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <TabIcon emoji="📚" focused={focused} />
              <TabLabel label="Diccionario" focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ArticlesTab"
        component={ArticlesStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <TabIcon emoji="📝" focused={focused} />
              <TabLabel label="Artículos" focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <TabIcon emoji="🔍" focused={focused} />
              <TabLabel label="Buscar" focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <TabIcon emoji="🔖" focused={focused} />
              <TabLabel label="Favoritos" focused={focused} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surfaceElevated,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
    paddingTop: 4,
  },
  iconWrapper: {
    width: 38,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapperActive: {
    backgroundColor: Colors.accentLight,
  },
  iconEmoji: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: FontSizes.xs,
    color: Colors.tabInactive,
    fontFamily: Typography.sans.medium,
  },
  tabLabelActive: {
    color: Colors.accent,
    fontFamily: Typography.sans.semiBold,
  },
});
