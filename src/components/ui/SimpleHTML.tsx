import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, Typography, FontSizes, Spacing } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';

interface SimpleHTMLProps {
  html: string;
}

type Segment = string | ['b' | 'i', string | Segment[]];

function isJSON(str: string): boolean {
  return str.trim().startsWith('[');
}

function renderSegments(
  segs: Segment[],
  pKey: string,
  styles: ReturnType<typeof createStyles>
): React.ReactNode[] {
  return segs.map((seg, si) => {
    const key = `${pKey}-s${si}`;
    if (typeof seg === 'string') {
      return <Text key={key}>{seg}</Text>;
    }
    const [type, inner] = seg;
    if (typeof inner === 'string') {
      return (
        <Text key={key} style={type === 'b' ? styles.bold : styles.italic}>
          {inner}
        </Text>
      );
    }
    return (
      <Text key={key} style={type === 'b' ? styles.bold : styles.italic}>
        {renderSegments(inner, key, styles)}
      </Text>
    );
  });
}

function renderJSON(
  jsonStr: string,
  styles: ReturnType<typeof createStyles>
): React.ReactNode[] {
  try {
    const paragraphs: Segment[][] = JSON.parse(jsonStr);
    return paragraphs.map((segs, pi) => (
      <Text key={`p-${pi}`} style={styles.paragraph}>
        {renderSegments(segs, `p-${pi}`, styles)}
      </Text>
    ));
  } catch {
    return [<Text key="e" style={styles.paragraph}>{jsonStr}</Text>];
  }
}

function renderPlain(
  text: string,
  styles: ReturnType<typeof createStyles>
): React.ReactNode[] {
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.map((p, i) => (
    <Text key={`p-${i}`} style={styles.paragraph}>{p.trim()}</Text>
  ));
}

export default function SimpleHTML({ html }: SimpleHTMLProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!html) return null;
  if (isJSON(html)) {
    return <>{renderJSON(html, styles)}</>;
  }
  return <>{renderPlain(html, styles)}</>;
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    paragraph: {
      fontFamily: Typography.serif.regular,
      fontSize: FontSizes.base,
      color: colors.textPrimary,
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
