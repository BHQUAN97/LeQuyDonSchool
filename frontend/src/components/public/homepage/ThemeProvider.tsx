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

/**
 * ThemeProvider — ap dung CSS variables + font-family cho homepage.
 * CSS vars (--hp-*) co the dung trong child components qua inline style hoac Tailwind arbitrary.
 * Font-family duoc ap dung truc tiep len wrapper de dam bao co hieu luc ngay.
 * Google Fonts duoc load on-demand khi chon font khac 'system'.
 */
export default function ThemeProvider({ theme, children }: { theme: ThemeConfig; children: React.ReactNode }) {
  const headingFont = FONT_MAP[theme.headingFont] || FONT_MAP.system;
  const bodyFont = FONT_MAP[theme.bodyFont] || FONT_MAP.system;
  const spacing = SPACING_MAP[theme.spacing] || SPACING_MAP.normal;

  // Load Google Fonts dynamically khi chon font khac system
  const fontsToLoad = [theme.headingFont, theme.bodyFont].filter(
    (f) => f !== 'system' && FONT_MAP[f],
  );
  const uniqueFonts = Array.from(new Set(fontsToLoad));

  const cssVars = {
    '--hp-primary': theme.primaryColor,
    '--hp-accent': theme.accentColor,
    '--hp-font-heading': headingFont,
    '--hp-font-body': bodyFont,
    '--hp-spacing': spacing,
    fontFamily: bodyFont,
  } as React.CSSProperties;

  return (
    <div style={cssVars}>
      {/* Load Google Fonts on-demand — chi load khi user chon font khac system */}
      {uniqueFonts.length > 0 && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?${uniqueFonts
            .map((f) => `family=${encodeURIComponent(f === 'Playfair' ? 'Playfair Display' : f)}:wght@400;600;700`)
            .join('&')}&display=swap`}
        />
      )}
      {children}
    </div>
  );
}
