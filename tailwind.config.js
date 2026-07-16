/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // DESIGN.md game palette (standards-pass). Use `text-game-primary-text`
        // for orange copy; `bg-game-primary` for fills/icons only.
        game: {
          primary: "#1671F8",
          "primary-light": "#2F80FF",
          "primary-text": "#1671F8", // 与 primary 同值：全局亮品牌蓝文案
          "primary-pressed": "#0759D5", // derived: darkened primary
          "primary-soft": "#EAF2FF",
          "primary-softest": "#F3F8FF", // derived
          "on-primary": "#FFFFFF",
          "reward-gold": "#E8B339",
          "reward-gold-soft": "#FBF1DA",
          "rank-gold": "#E8B339",
          "rank-silver": "#C6C6C6",
          "rank-bronze": "#C97A3D",
          "priority-urgent": "#DC5B4C",
          "priority-featured": "#E8B339",
          "priority-normal": "#3A7BD5",
          "priority-default": "#B9B7B0",
          ink: "#171A21",
          "ink-secondary": "#707681",
          "ink-tertiary": "#9AA0AA",
          "ink-disabled": "#C4C8D0", // derived
          "ink-nav-inactive": "#555B65", // Bottom Navigation inactive icon/label only
          "bg-page": "#F7F9FC",
          "bg-card": "#FFFFFF",
          "bg-muted": "#F2F4F8", // derived
          "border-light": "#E7EAF0",
          divider: "#E9ECF1",
          "chart-line": "#1671F8",
          success: "#1DA463",
          error: "#DC5B4C",
          "error-soft": "#FCEFED",
          warning: "#E8873F",
          info: "#3A7BD5",
          "info-soft": "#EAF1FB",
          overlay: "rgba(23,26,33,0.45)",
          "focus-ring": "rgba(22,113,248,0.35)",
          // Dark theme — DESIGN.md cool charcoal (brand-blue hue family, not warm brown or cool slate)
          "bg-page-dark": "#101217",
          "bg-card-dark": "#1A1D24",
          "bg-muted-dark": "#21242A",
          "border-light-dark": "#2D313A",
          "divider-dark": "#272B32",
          "ink-dark": "#EAEDF5",
          "ink-secondary-dark": "#9EA3B0",
          "ink-tertiary-dark": "#787D8A",
          "ink-disabled-dark": "#4F535C",
          "primary-soft-dark": "#18263A",
          "primary-softest-dark": "#121924",
          "reward-gold-soft-dark": "#3A3220",
          "info-soft-dark": "#1E2A38",
          "success-soft-dark": "#1A2E24",
          "error-soft-dark": "#3A2220",
          // Legacy aliases (same values) — prefer *-dark names above
          "surface-soft-dark": "#21242A",
          "hairline-dark": "#2D313A",
        },
      },
      // Apple HIG Dynamic Type stops — see DESIGN.md typography
      fontSize: {
        "display-lg": ["28px", { lineHeight: "1.2", fontWeight: "700" }],
        "identity-name": ["20px", { lineHeight: "1.2", fontWeight: "600" }],
        "hero-number": ["28px", { lineHeight: "1.15", fontWeight: "700" }],
        "task-title": ["17px", { lineHeight: "1.35", fontWeight: "500" }],
        "section-title": ["15px", { lineHeight: "1.3", fontWeight: "600" }],
        "grid-label": ["15px", { lineHeight: "1.3", fontWeight: "500" }],
        "hud-number": ["13px", { lineHeight: "1.2", fontWeight: "700" }],
        "hud-label": ["13px", { lineHeight: "1.2", fontWeight: "600" }],
        body: ["13px", { lineHeight: "1.45", fontWeight: "400" }],
        "tab-label": ["11px", { lineHeight: "1.2", fontWeight: "500" }],
        caption: ["11px", { lineHeight: "1.4", fontWeight: "400" }],
        "section-label": ["11px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "0.4px" }],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        // DESIGN.md rounded scale (8/12/16/24 + semantic names)
        small: "8px",
        medium: "16px",
        large: "24px",
        card: "16px",
        tile: "8px",
        button: "12px",
        chip: "9999px",
        pill: "9999px",
        badge: "14px",
        "nav-top": "28px",
      },
      // DESIGN.md decorative hairline (function grid / list dividers)
      borderWidth: {
        hairline: "0.5px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        warm: "0 10px 35px 0 rgba(22,113,248,0.10)", // name predates the blue rebrand, value now matches game.shadow-warm
        "warm-dark": "0 10px 35px 0 rgba(6,8,12,0.45)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}