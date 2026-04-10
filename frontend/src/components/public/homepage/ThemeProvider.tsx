'use client';

interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  spacing: 'compact' | 'normal' | 'spacious';
}

const FONT_MAP: Record<string, string> = {
  system: 'system-ui, -apple-system, sans-serif',
  Inter: "'Inter', system-ui, sans-serif",
  Roboto: "'Roboto', system-ui, sans-serif",
  Montserrat: "'Montserrat', system-ui, sans-serif",
  Playfair: "'Playfair Display', Georgia, serif",
  'Open Sans': "'Open Sans', system-ui, sans-serif",
  Lora: "'Lora', Georgia, serif",
};

const SPACING_MAP: Record<string, string> = {
  compact: '2rem',
  normal: '4rem',
  spacious: '6rem',
};

export default function ThemeProvider({ theme, children }: { theme: ThemeConfig; children: React.ReactNode }) {
  const cssVars = {
    '--hp-primary': theme.primaryColor,
    '--hp-accent': theme.accentColor,
    '--hp-font-heading': FONT_MAP[theme.headingFont] || FONT_MAP.system,
    '--hp-font-body': FONT_MAP[theme.bodyFont] || FONT_MAP.system,
    '--hp-spacing': SPACING_MAP[theme.spacing] || SPACING_MAP.normal,
  } as React.CSSProperties;

  return <div style={cssVars}>{children}</div>;
}
