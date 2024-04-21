import { LocaleTypes } from '@/i18n/settings'

export type Params = {
  params: {
    locale: LocaleTypes
    id: string
  }
}
export type ParamsId = {
  params: { id: string }
}

export type ParamsLng = {
  params: {
    locale: LocaleTypes
  }
}
