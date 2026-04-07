import { Navbar } from "@/components/shared/Navbar"
import { ReactNode } from "react"

// export const dynamic = "force-dynamic";

const CommonLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar></Navbar>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      {/* <Footer></Footer> */}
    </div>
  )
}

export default CommonLayout
