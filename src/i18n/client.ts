'use client'

import { useEffect, useState } from 'react'
import i18next, { FlatNamespace, KeyPrefix, i18n } from 'i18next'
import {
  FallbackNs,
  UseTranslationOptions,
  UseTranslationResponse,
  initReactI18next,
  useTranslation as useTransAlias,
  useTranslation as useTranslationOrg,
} from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { type LocaleTypes, getOptions, locales, cookieName } from './settings'
import { useCookies } from 'react-cookie'

const runsOnServerSide = typeof window === 'undefined'

// Initialize i18next for the client side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // detect the language on the client
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? locales : [],
  })

// export function useTranslation(lng: LocaleTypes, ns: string) {
//   const translator = useTransAlias(ns)
//   const { i18n } = translator

//   // Run content is being rendered on server side
//   if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
//     i18n.changeLanguage(lng)
//   } else {
//     // Use our custom implementation when running on client side
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     useCustomTranslationImplem(i18n, lng)
//   }
//   return translator
// }
// function useCustomTranslationImplem(i18n: i18n, lng: LocaleTypes) {
//   // This effect changes the language of the application when the lng prop changes.
//   useEffect(() => {
//     if (!lng || i18n.resolvedLanguage === lng) return
//     i18n.changeLanguage(lng)
//   }, [lng, i18n])
// }

export function getTranslationClient<Ns extends FlatNamespace, KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined>(
  lng: string,
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cookies, setCookie] = useCookies([cookieName])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return
      i18n.changeLanguage(lng)
    }, [lng, i18n])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (cookies[cookieName] === lng) return
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setCookie(cookieName, lng, { path: '/' })
    }, [lng, cookies[cookieName]])
  }
  return ret
}
