// export { onPrerenderStart }
// import type { OnPrerenderStartAsync, PageContextServer } from 'vike/types'

// const locales = ['en', 'de']
// const localeDefault = 'en'

// const onPrerenderStart: OnPrerenderStartAsync = (prerenderContext) => prerenderContext
//   const pageContexts: PageContextServer[] = []
//   prerenderContext.pageContexts.forEach((pageContext) => {
//     // Duplicate pageContext for each locale
//     // locales.forEach((locale) => {
//     //   // Localize URL
//     //   let { urlOriginal } = pageContext
//     //   if (locale !== localeDefault) {
//     //     urlOriginal = `/${locale}${pageContext.urlOriginal}`
//     //   }
//     //   pageContexts.push({
//     //     ...pageContext,
//     //     urlOriginal,
//     //     // Set pageContext.locale
//     //     locale
//     //   })
//     // })
//   })
//   return Promise.resolve({
//     prerenderContext: {
//       pageContexts,
//     },
//   });
// }
