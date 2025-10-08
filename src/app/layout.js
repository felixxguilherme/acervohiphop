import "./globals.css";
import { scratchyFont } from "./fonts";
import { sometypeMonoFont } from "./fonts";
import { dirtyStainsFont } from "./fonts";
import HeaderApp from "@/components/html/HeaderApp";
import FooterApp from "@/components/html/FooterApp";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeBackground from "@/components/ThemeBackground";

export const metadata = {
  title: "Acervo Hip-Hop Distrito Federal",
  description: "Memória viva de um movimento.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${scratchyFont.variable} ${sometypeMonoFont.variable} ${dirtyStainsFont.variable} antialiased`}
      >
        <ThemeProvider>
          <ThemeBackground />
          <div className="min-h-screen flex flex-col relative z-10">
            
              {children}
                   
            {/* Footer */}
            <FooterApp />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}