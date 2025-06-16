import HeaderApp from "@/components/html/HeaderApp"

export default function MapaLayout({ children }) {
  return (
    <>
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/fundo_base.jpg')`,
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