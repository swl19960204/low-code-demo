import { nanoid } from 'nanoid'

export const generateID = () => {
  return nanoid()
}

export const swap = (data, i, j) => {
  const temp = data[i]
  data[i] = data[j]
  data[j] = temp
}
