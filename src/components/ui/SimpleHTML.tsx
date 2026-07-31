import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, Typography, FontSizes, Spacing } from '../../constants/theme';

interface SimpleHTMLProps {
  html: string;
}

type Segment = string | ['b' | 'i', string];

function isJSON(str: string): boolean {
  return str.trim().startsWith('[');
}

function renderSegments(segs: Segment[], pKey: string): React.ReactNode[] {
  return segs.map((seg, si) => {
    const key = `${pKey}-s${si}`;
    if (typeof seg === 'string') {
      return <Text key={key}>{seg}</Text>;
    }
    const [type, text] = seg;
    if (type === 'b') {
      return <Text key={key} style={styles.bold}>{text}</Text>;
    }
    if (type === 'i') {
      return <Text key={key} style={styles.italic}>{text}</Text>;
    }
    return <Text key={key}>{text}</Text>;
  });
}

function renderJSON(jsonStr: string): React.ReactNode[] {
  try {
    const paragraphs: Segment[][] = JSON.parse(jsonStr);
    return paragraphs.map((segs, pi) => (
      <Text key={`p-${pi}`} style={styles.paragraph}>
        {renderSegments(segs, `p-${pi}`)}
      </Text>
    ));
  } catch {
    return [<Text key="e" style={styles.paragraph}>{jsonStr}</Text>];
  }
}

function renderPlain(text: string): React.ReactNode[] {
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.map((p, i) => (
    <Text key={`p-${i}`} style={styles.paragraph}>{p.trim()}</Text>
  ));
}

export default function SimpleHTML({ html }: SimpleHTMLProps) {
  if (!html) return null;
  if (isJSON(html)) {
    return <>{renderJSON(html)}</>;
  }
  return <>{renderPlain(html)}</>;
}

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: Typography.serif.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  bold: {
    fontFamily: Typography.serif.bold,
  },
  italic: {
    fontFamily: Typography.serif.italic,
  },
});
