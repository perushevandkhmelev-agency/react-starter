import { css } from 'styled-components'

export const colors = {
  nprogress: 'black'
}

export const zIndex = {
  modal: 999
}

const dimensions = {
  desktop: 600
}

export const media = {
  mobile: (...args) => css`
    @media (max-width: ${dimensions.desktop - 1}px) {
      ${css(...args)};
    }
  `,
  desktop: (...args) => css`
    @media (min-width: ${dimensions.desktop}px) {
      ${css(...args)};
    }
  `
}

export const onlyMobile = css`
  @media (min-width: ${dimensions.desktop}px) {
    display: none !important;
  }
`

export const onlyDesktop = css`
  @media (max-width: ${dimensions.desktop - 1}px) {
    display: none !important;
  }
`

export const listStyleNone = css`
  margin: 0;
  padding: 0;
  list-style: none;
`
