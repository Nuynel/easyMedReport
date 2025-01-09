import type {PageContextServer} from 'vike/types'
import {modifyUrl} from "vike/modifyUrl";
// import extractLocaleFromUrl from "../src/shared/helpers/extractLocaleFromUrl";

function onBeforeRoute(pageContext: PageContextServer) {
  // const { pathnameWithoutLocale, locale } = extractLocaleFromUrl(pageContext.urlParsed)

  return {
    pageContext: {
      // locale,
      // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal
      // urlLogical: modifyUrl(pageContext.urlParsed.href, { pathname: pathnameWithoutLocale })
    }
  }
}

export { onBeforeRoute }
