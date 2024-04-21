import { createContext } from 'react'

type FormContextType = {
  defaultLayout: 'vertical' | 'horizontal'
  readOnly: boolean
}

export const FormContext = createContext<FormContextType>({
  defaultLayout: 'horizontal',
  readOnly: false,
})
