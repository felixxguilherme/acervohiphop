import Link from 'next/link';

export default function FooterApp() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-theme-primary relative z-10 border-t-3 border-solid border-theme text-center">
       <p className="text-theme-primary mt-4 mb-4">
            © {currentYear} Distrito HipHop. Todos os direitos reservados. <span>📧 contato@distritohiphop.com</span>
          </p>
    </footer>
  );
}