import HeaderApp from "@/components/html/HeaderApp"

export default function RevistaLayout({ children }) {
  return (
    <>
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/fundo_base.webp')`,
          backgroundColor: '#000',
        }}
        aria-hidden="true"
      />
      <section>
        {children}
      </section>
    </>
  )
}