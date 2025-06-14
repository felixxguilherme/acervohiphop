export default function AcervoLayout({ children }) {
    return (
      <section>
        {/* Elementos de layout específicos para a seção de acervo */}
        <div className="bg-gray-100 p-4 mb-4">
          <h2 className="text-xl font-semibold">Navegação do Acervo</h2>
          {/* Aqui você pode adicionar navegação específica do acervo */}
        </div>
        
        {/* Renderiza o conteúdo da página (children) */}
        {children}
      </section>
    )
  }