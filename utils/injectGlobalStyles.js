import { injectGlobal } from 'styled-components'
import { normalize, fontFace } from 'polished'

export default () => {
  injectGlobal`
    ${normalize()}
    
    *,
    *:before,
    *:after {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html {
      width: 100%;
      height: 100%;
    }

    html,
    body {
      margin: 0px;
      padding: 0px;
      font-weight: normal;
      -webkit-font-smoothing: antialiased;
    }

    a,
    a:visited {
      color: inherit;
      text-decoration: none;
      transition: color 0.2s;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 0;
    }

    .max-height {
      height: 100%;
    }
  `
}
