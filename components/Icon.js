import styled, { injectGlobal } from 'styled-components'
import { fontFace } from 'polished'
import config from 'assets/fonts/icons/config.json'

injectGlobal`
  ${fontFace({
    fontFamily: config.name,
    fontFilePath: `/assets/fonts/icons/${config.name}`,
    fileFormats: ['woff', 'woff2']
  })}
`

const nameToChar = name => {
  const glyph = config.glyphs.find(item => item.css === name)
  if (glyph) {
    return String.fromCodePoint(glyph.code)
  } else {
    return ''
  }
}

export default styled.i`
  font-family: ${config.name};
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:before {
    content: '${props => nameToChar(props.name)}';
  }
`
