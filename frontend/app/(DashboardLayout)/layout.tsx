import { ReactNode } from "react"

const CommonLayout = async ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>
}

export default CommonLayout
