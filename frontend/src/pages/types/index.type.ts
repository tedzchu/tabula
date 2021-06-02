import { Block } from "@/components/editablePage/editablePage.type";

export type PageProps = {
  pid: string
  blocks: Block[]
  err: boolean
}