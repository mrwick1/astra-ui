import type { ReactNode } from 'react';
import {
  Badge,
  Text,
  Spinner,
  ThemeProvider,
  useTheme,
} from '@astra-ui/core';

/* ------------------------------------------------------------------ */
/*  Providers                                                          */
/* ------------------------------------------------------------------ */

function Providers({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return <ThemeProvider value={{ theme }}>{children}</ThemeProvider>;
}

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */

function SectionHeader({
  index,
  label,
  title,
  description,
  accent,
}: {
  index: string;
  label: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="mb-14">
      <p className={`font-code text-xs ${accent} mb-3 tracking-[0.2em] uppercase`}>
        {index} — {label}
      </p>
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
        {title}
      </h2>
      <p className="text-base text-slate-400 max-w-lg leading-relaxed">{description}</p>
    </div>
  );
}

function Card({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`glass p-8 ${className}`}>
      <p className="font-code text-[11px] text-slate-500 mb-5 tracking-[0.15em] uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#06060e]/70 border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-heading font-bold text-lg tracking-tight text-white">
          astra<span className="text-violet-400">.</span>ui
        </a>
        <div className="hidden sm:flex items-center gap-8">
          <a href="#badge" className="text-sm text-slate-400 hover:text-white transition-colors">Badge</a>
          <a href="#text" className="text-sm text-slate-400 hover:text-white transition-colors">Text</a>
          <a href="#spinner" className="text-sm text-slate-400 hover:text-white transition-colors">Spinner</a>
          <a
            href="https://github.com/mrwick1/astra-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="text-center max-w-4xl mx-auto">
        <div className="animate-fade-up mb-8">
          <Badge color="purple" tone="light" size="sm" radius="full">
            v0.1.1
          </Badge>
        </div>

        <h1 className="font-heading text-[clamp(3.5rem,10vw,8rem)] font-extrabold leading-[0.9] tracking-tight mb-8 animate-fade-up delay-1">
          <span className="block bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
            Astra UI
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto mb-12 animate-fade-up delay-2 leading-relaxed">
          Composable React components crafted with Tailwind&nbsp;CSS,
          class&#8209;variance&#8209;authority, and TypeScript.
        </p>

        <div className="animate-fade-up delay-3 inline-flex items-center">
          <code className="font-code text-sm bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 py-3.5 text-slate-300 select-all">
            pnpm add @astra-ui/core
          </code>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-slate-600 flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-slate-500 rounded-full" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Badge Showcase                                                     */
/* ------------------------------------------------------------------ */

function BadgeShowcase() {
  return (
    <section id="badge" className="px-6 py-24 max-w-6xl mx-auto">
      <SectionHeader
        index="01"
        label="Badge"
        title="Status, at a glance"
        description="Versatile status indicators with four tones, nine colors, and six semantic variants."
        accent="text-violet-400"
      />

      <div className="grid gap-5">
        <Card label="Tones">
          <div className="flex flex-wrap items-center gap-3">
            <Badge color="purple" tone="solid" size="md">Solid</Badge>
            <Badge color="purple" tone="light" size="md">Light</Badge>
            <Badge color="purple" tone="glossy" size="md">Glossy</Badge>
            <Badge color="purple" tone="outline" size="md">Outline</Badge>
          </div>
        </Card>

        <Card label="Color Palette">
          <div className="flex flex-wrap items-center gap-3">
            <Badge color="blue" tone="solid" size="sm">Blue</Badge>
            <Badge color="red" tone="solid" size="sm">Red</Badge>
            <Badge color="green" tone="solid" size="sm">Green</Badge>
            <Badge color="yellow" tone="solid" size="sm">Yellow</Badge>
            <Badge color="purple" tone="solid" size="sm">Purple</Badge>
            <Badge color="gray" tone="solid" size="sm">Gray</Badge>
            <Badge color="dark" tone="solid" size="sm">Dark</Badge>
            <Badge color="black" tone="solid" size="sm">Black</Badge>
            <Badge color="white" tone="solid" size="sm">White</Badge>
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-5">
          <Card label="Semantic Variants">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="primary" size="md">Primary</Badge>
              <Badge variant="secondary" size="md">Secondary</Badge>
              <Badge variant="danger" size="md">Danger</Badge>
              <Badge variant="success" size="md">Success</Badge>
              <Badge variant="warning" size="md">Warning</Badge>
              <Badge variant="info" size="md">Info</Badge>
            </div>
          </Card>

          <Card label="Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Badge color="purple" tone="solid" size="xs">Extra Small</Badge>
              <Badge color="purple" tone="solid" size="sm">Small</Badge>
              <Badge color="purple" tone="solid" size="md">Medium</Badge>
              <Badge color="purple" tone="solid" size="lg">Large</Badge>
            </div>
          </Card>
        </div>

        <Card label="Tone x Color Matrix">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {(['solid', 'light', 'glossy', 'outline'] as const).map((tone) => (
              <div key={tone} className="space-y-2.5">
                <p className="font-code text-[10px] text-slate-600 uppercase tracking-wider">
                  {tone}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge color="blue" tone={tone} size="xs">Aa</Badge>
                  <Badge color="red" tone={tone} size="xs">Aa</Badge>
                  <Badge color="green" tone={tone} size="xs">Aa</Badge>
                  <Badge color="yellow" tone={tone} size="xs">Aa</Badge>
                  <Badge color="purple" tone={tone} size="xs">Aa</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Text Showcase                                                      */
/* ------------------------------------------------------------------ */

const DISPLAY_VARIANTS = [
  { variant: 'd1', text: 'Astra' },
  { variant: 'd2', text: 'Stellar' },
  { variant: 'd3', text: 'Cosmos' },
  { variant: 'd4', text: 'Nebula' },
] as const;

const HEADING_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

const WEIGHTS = [
  'thin', 'extraLight', 'light', 'normal', 'medium', 'semiBold', 'bold', 'extraBold', 'black',
] as const;

const TEXT_COLORS = ['white', 'blue', 'red', 'green', 'yellow', 'purple', 'gray'] as const;

function TextShowcase() {
  return (
    <section id="text" className="px-6 py-24 max-w-6xl mx-auto">
      <SectionHeader
        index="02"
        label="Text"
        title="Typography, refined"
        description="Polymorphic text component with display, heading, and paragraph presets. Renders as any HTML element via the as prop."
        accent="text-cyan-400"
      />

      <div className="grid gap-5">
        <Card label="Display Scale" className="overflow-hidden">
          <div className="space-y-6">
            {DISPLAY_VARIANTS.map(({ variant, text }) => (
              <div
                key={variant}
                className="flex items-baseline gap-6 border-b border-white/[0.03] pb-6 last:border-0 last:pb-0"
              >
                <code className="font-code text-[11px] text-slate-600 w-8 shrink-0">
                  {variant}
                </code>
                <div className="min-w-0 overflow-hidden">
                  <Text variant={variant} color="white">{text}</Text>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card label="Heading Scale">
          <div className="space-y-4">
            {HEADING_VARIANTS.map((variant) => (
              <div
                key={variant}
                className="flex items-baseline gap-6 border-b border-white/[0.03] pb-4 last:border-0 last:pb-0"
              >
                <code className="font-code text-[11px] text-slate-600 w-8 shrink-0">
                  {variant}
                </code>
                <Text as={variant} variant={variant} color="white">
                  The quick brown fox
                </Text>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-5">
          <Card label="Weight Scale">
            <div className="space-y-2.5">
              {WEIGHTS.map((w) => (
                <div key={w} className="flex items-baseline justify-between">
                  <Text size="base" weight={w} color="white">{w}</Text>
                  <code className="font-code text-[10px] text-slate-600">{w}</code>
                </div>
              ))}
            </div>
          </Card>

          <Card label="Color Palette">
            <div className="space-y-2.5">
              {TEXT_COLORS.map((c) => (
                <div key={c} className="flex items-baseline justify-between">
                  <Text size="base" weight="medium" color={c}>
                    The quick brown fox
                  </Text>
                  <code className="font-code text-[10px] text-slate-600">{c}</code>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Spinner Showcase                                                   */
/* ------------------------------------------------------------------ */

const SPINNER_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const SPINNER_COLORS = ['gray', 'slate', 'white'] as const;

function SpinnerShowcase() {
  return (
    <section id="spinner" className="px-6 py-24 max-w-6xl mx-auto">
      <SectionHeader
        index="03"
        label="Spinner"
        title="Loading, gracefully"
        description="SVG-based loading indicators in five sizes and three color schemes."
        accent="text-emerald-400"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <Card label="Size Scale">
          <div className="flex items-end gap-6">
            {SPINNER_SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-3">
                <Spinner size={size} color="gray" />
                <code className="font-code text-[10px] text-slate-600">{size}</code>
              </div>
            ))}
          </div>
        </Card>

        <Card label="Colors">
          <div className="flex items-end gap-8">
            {SPINNER_COLORS.map((color) => (
              <div key={color} className="flex flex-col items-center gap-3">
                <Spinner size="lg" color={color} />
                <code className="font-code text-[10px] text-slate-600">{color}</code>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-sm text-white">
            astra<span className="text-violet-400">.</span>ui
          </span>
          <span className="text-slate-600 text-sm">&middot;</span>
          <span className="text-sm text-slate-500">MIT License</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/mrwick1/astra-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-white transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/@astra-ui/core"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-white transition-colors duration-200"
          >
            npm
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <Providers>
      <div className="min-h-screen bg-[#06060e] text-slate-100">
        {/* Ambient gradient orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[300px] -left-[200px] w-[700px] h-[700px] rounded-full bg-violet-600/[0.07] blur-[150px] animate-drift" />
          <div className="absolute -bottom-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.05] blur-[130px] animate-drift-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/[0.04] blur-[180px]" />
        </div>

        {/* Grid overlay */}
        <div className="fixed inset-0 grid-pattern pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          <Nav />
          <Hero />
          <BadgeShowcase />
          <TextShowcase />
          <SpinnerShowcase />
          <Footer />
        </div>
      </div>
    </Providers>
  );
}
