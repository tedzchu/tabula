import { Block } from "../editablePage/editablePage.type"

export type Props = {
  id: string
  position: number
  html: string
  tag: string
  updatePage: PageUpdater
  addBlock: BlockHandler
  deleteBlock: BlockHandler
}

type PageUpdater = (block: Block) => void

type BlockHandler = (block: Block) => void

export type Coordinates = {
  x: number
  y: number
}