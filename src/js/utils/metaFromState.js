export default function({ meta }) {
  let metaTags = []

  metaTags = metaTags.concat('<meta property="og:site_name" content="Project" />')

  if (meta.title) {
    metaTags = metaTags.concat(`<title>${meta.title}</title>`)
    metaTags = metaTags.concat(`<meta property="og:title" content="${meta.title}" />`)
    metaTags = metaTags.concat(`<meta name="twitter:title" content="${meta.title}" />`)
  }

  if (meta.description) {
    metaTags = metaTags.concat(`<meta property="og:description" content="${meta.description}" />`)
    metaTags = metaTags.concat(`<meta name="twitter:description" content="${meta.description}" />`)
    metaTags = metaTags.concat(`<meta name="description" content="${meta.description}" />`)
  }

  if (meta.image) {
    metaTags = metaTags.concat(`<meta property="og:image" content="${meta.image}" />`)
    metaTags = metaTags.concat(`<meta name="twitter:image" content="${meta.image}" />`)
    metaTags = metaTags.concat(`<link rel="image_src" href="${meta.image}">`)
  }

  if (meta.css && meta.css.length > 0) {
    metaTags = metaTags.concat(meta.css.map(css => `<link href="${css}" rel="stylesheet">`))
  }

  if (meta.js && meta.js.length > 0) {
    metaTags = metaTags.concat(meta.js.map(js => `<script src="${js}"></script>`))
  }

  return metaTags.join('\n')
}
