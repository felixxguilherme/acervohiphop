import Link from 'next/link';

export default function FooterApp() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-black relative z-10 border-t-3 border-solid border-black text-center">
       <p className="text-black mt-4 mb-4">
            © {currentYear} Distrito HipHop. Todos os direitos reservados. <span>📧 contato@distritohiphop.com</span>
          </p>
    </footer>
  );
}