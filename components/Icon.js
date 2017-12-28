import styled, { injectGlobal } from 'styled-components'
import config from 'assets/fonts/icons/config.json'
import IconsWoff from 'assets/fonts/icons/icons.woff'
import IconsWoff2 from 'assets/fonts/icons/icons.woff2'

injectGlobal`
  @font-face {
    font-family: ${config.name};
    src: url(${IconsWoff2}) format("woff2"), url(${IconsWoff}) format("woff");
  }
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:before {
    content: '${props => nameToChar(props.name)}';
  }
`
