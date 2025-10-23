import "./globals.css";
import { scratchyFont } from "./fonts";
import { sometypeMonoFont } from "./fonts";
import { dirtyStainsFont } from "./fonts";
import HeaderApp from "@/components/html/HeaderApp";
import FooterApp from "@/components/html/FooterApp";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AcervoProvider } from "@/contexts/AcervoContext";
import ThemeBackground from "@/components/ThemeBackground";
import ImagePreloader from "@/components/ImagePreloader";
import GlobalLoader from "@/components/GlobalLoader";

export const metadata = {
  title: "Distrito HipHop - Memórias Vivas de um Movimento",
  description: "Acervo digital do movimento Hip Hop no Distrito Federal. Patrimônio Cultural Imaterial reconhecido em 2023.",
  keywords: "Hip Hop, Distrito Federal, Brasília, cultura, acervo, memória, movimento, rap, breaking, grafite, DJ",
  authors: [{ name: "Coletivo Distrito Hip Hop" }],
  creator: "Coletivo Distrito Hip Hop",
  publisher: "Distrito HipHop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.webp', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.webp', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.webp', sizes: '96x96', type: 'image/png' }
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/apple-touch-icon.webp', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://distritohiphop.com',
    siteName: 'Distrito HipHop',
    title: 'Distrito HipHop - Memórias Vivas de um Movimento',
    description: 'Acervo digital do movimento Hip Hop no Distrito Federal. Patrimônio Cultural Imaterial reconhecido em 2023.',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Distrito HipHop - Memórias Vivas de um Movimento'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Distrito HipHop - Memórias Vivas de um Movimento',
    description: 'Acervo digital do movimento Hip Hop no Distrito Federal.',
    images: ['/og-image.webp']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preload critical background images with high priority */}
        <link rel="preload" as="image" href="/fundo_base.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/fundo_base_preto.webp" fetchPriority="high" />
        
        {/* Preload essential UI images */}
        <link rel="preload" as="image" href="/marca-texto-amarelo.webp" fetchPriority="low" />
        <link rel="preload" as="image" href="/marca-texto-vermelho.webp" fetchPriority="low" />
        <link rel="preload" as="image" href="/marca-texto-azul.webp" fetchPriority="low" />
        <link rel="preload" as="image" href="/marca-texto-verde.webp" fetchPriority="low" />
        
        {/* Resource hints para otimização */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${scratchyFont.variable} ${sometypeMonoFont.variable} ${dirtyStainsFont.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider>
          <AcervoProvider>
            <GlobalLoader>
              <ImagePreloader />
              <ThemeBackground />
              <div className="min-h-screen flex flex-col relative z-10">
                
                  {children}
                       
                {/* Footer */}
                <FooterApp />
              </div>
            </GlobalLoader>
          </AcervoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}