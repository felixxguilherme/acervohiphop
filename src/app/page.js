'use client';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function Home() {
    return (
    <main 
      className="main w-full overflow-x-hidden overflow-y-auto"
      style={{
        backgroundImage: 'url(/fundo-base-branca-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Conteúdo centralizado - 100vh */}
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-4xl mx-auto text-center"
        ><div className="bg-white/70 p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Tape no canto superior esquerdo */}
          <div 
            className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 md:-top-12 md:-left-12 w-16 h-32 sm:w-20 sm:h-40 md:w-24 md:h-48 lg:w-32 lg:h-64 z-20 opacity-80 sm:opacity-90"
            style={{
              backgroundImage: 'url(/silvertape01.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              transform: 'rotate(-45deg)'
            }}
          />
          
          {/* Tape no canto inferior direito */}
          <div 
            className="absolute -bottom-3 -right-6 sm:-bottom-4 sm:-right-8 md:-bottom-6 md:-right-12 lg:-bottom-6 lg:-right-16 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 z-20 opacity-80 sm:opacity-90"
            style={{
              backgroundImage: 'url(/silvertape02.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              transform: 'rotate(-45deg)'
            }}
          />
            {/* Título principal */}
          <h1 className="font-dirty-stains text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-black mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
            ACERVO DISTRITO HIP HOP
          </h1>
          
          {/* Mensagem de lançamento */}
          <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            <p className="font-sometype-mono text-base sm:text-lg md:text-xl lg:text-2xl text-black font-bold leading-relaxed">
              A plataforma do Acervo Distrito Hip Hop será lançada no dia 20 de outubro de 2025.
            </p>
            
            <div className="py-4 sm:py-6 my-4 sm:my-6">
              <p className="font-sometype-mono text-sm sm:text-base md:text-lg lg:text-xl text-black mb-3 sm:mb-4">
                Inscreva-se gratuitamente na Semana de Lançamento e acompanhe todas as atividades:
              </p>
              
              <Link 
                href="https://forms.gle/NDLNNsCjefCvgxcR9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#fae523] hover:bg-[#f8e71c] text-black font-sometype-mono font-bold text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto"
              >
                CLIQUE AQUI PARA SE INSCREVER
              </Link>
            </div>
            
            <div className="pt-2 sm:pt-4">
              <p className="font-sometype-mono text-sm sm:text-base md:text-lg text-black mb-2 sm:mb-3">
                Siga e saiba mais em nosso Instagram:
              </p>
              <Link 
                href="https://www.instagram.com/acervodistritohiphop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-dirty-stains text-xl sm:text-2xl md:text-3xl text-black hover:text-[#fae523] transition-colors break-all sm:break-normal"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm sm:text-base md:text-xl lg:text-2xl">@acervodistritohiphop</span>
              </Link>            </div>          </div>
        </div>
      </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#e3d5ca] backdrop-blur-sm py-4 sm:py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sometype-mono text-xs sm:text-sm md:text-base text-black italic mb-3 sm:mb-4">
            Este projeto é realizado com recursos do Fundo de Apoio à Cultura do Distrito Federal.
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12">
            <img 
              src="/fac.png" 
              alt="FAC - Fundo de Apoio à Cultura" 
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
            <img 
              src="https://www.df.gov.br/wp-conteudo/themes/templategdf/img/logogdf_1.svg" 
              alt="Governo do Distrito Federal" 
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
          </div>
        </div>
      </footer>
    </main>
  )
}