/// <reference types="vite/client" />

declare global {
  // imported data
  type ImportData = string[][]

  interface Item {
    // TODO: Add uid
    name: string
  }
  interface Group {
    name: string
    items: Item[]
  }

  interface Groups {
    [key: string]: Group
  }
}

export { }
