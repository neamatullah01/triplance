import { Navbar } from "@/components/shared/Navbar"
import { ReactNode } from "react"

// export const dynamic = "force-dynamic";

const CommonLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar></Navbar>
      {children}
      {/* <Footer></Footer> */}
    </div>
  )
}

export default CommonLayout
