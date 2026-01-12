import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />
      <main className="lg:pl-60">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
