import styled, { injectGlobal } from 'styled-components'
import config from 'assets/fonts/icons/config.json'

injectGlobal`
  @font-face {
    font-family: ${config.name};
    src: url(${require(`../assets/fonts/icons/${config.name}.woff2`)}) format("woff2"),
         url(${require(`../assets/fonts/icons/${config.name}.woff`)}) format("woff");
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
