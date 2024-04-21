import { createInstance, FlatNamespace, KeyPrefix } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { getOptions, LocaleTypes } from './settings'
import { FallbackNs } from 'react-i18next'

const initI18next = async (lang: LocaleTypes, ns: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: typeof ns) => import(`./locales/${language}/${namespace}.json`)),
    )
    .init(getOptions(lang, ns))

  return i18nInstance
}

// export async function createTranslation(lang: LocaleTypes, ns: string) {
//   const i18nextInstance = await initI18next(lang, ns)

//   return {
//     t: i18nextInstance.getFixedT(lang, Array.isArray(ns) ? ns[0] : ns),
//   }
// }

export async function getTranslationServer<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(lang: LocaleTypes, ns?: Ns, options: { keyPrefix?: KPrefix } = {}) {
  const i18nextInstance = await initI18next(
    lang,
    ns as string,
    // Array.isArray(ns) ? (ns as string[]) : (ns as string),
  )
  return {
    t: i18nextInstance.getFixedT(lang, ns, options.keyPrefix),
    i18n: i18nextInstance,
  }
}
