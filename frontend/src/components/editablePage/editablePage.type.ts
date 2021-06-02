export type Props = {
  id: string
  fetchedBlocks: Block[]
  err: boolean
}

export type Block = {
  _id: string
  html: string
  tag: string // maybe enum eventually?
  ref?: HTMLElement | null
}