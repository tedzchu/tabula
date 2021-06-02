export type Props = {
  menuItems: Item[]
  closeAction: () => void,
  isTopNavigation?: boolean
}

export type Item = {
  id: string
  label: string
  action: () => void
}

export type Position = {
  top?: string
  bottom?: string
  left?: string
  right?: string
}