import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import RootLayout from 'rootLayout'
import { MDXProvider } from '@mdx-js/tag'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import mdxComponents from 'components/mdx'
import { sizes, colors, animationSpeeds, fontSizes } from 'consts/design'
import MoonSVG from 'assets/moon.svg'
import SunSVG from 'assets/sun.svg'


const styles = {
  container: {
    maxWidth: sizes.contentMaxWidth,
    margin: `0 auto 80px auto`,
    padding: `0 20px`,
  },
  pageHeader: {
    marginTop: 60,
    marginBottom: 100,
    // textAlign: `center`,
  },
  siteTitle: {
    fontSize: 80,
    fontFamily: `Archery Black`,
  },
  name: {
    fontSize: 30,
    fontFamily: `Archery Black`,
    letterSpacing: `1px`,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: `100%`,
    backgroundPosition: `center center`,
    backgroundSize: `cover`,
    // margin: `0 auto`,
  },
  article: {
    transition: `color ${animationSpeeds.normal}ms linear`,
  },
  articleHeader: {
    marginBottom: 50,
  },
  heading: {
    fontSize: fontSizes.heading,
    marginBottom: 20,
    fontWeight: `600`,
    lineHeight: `1em`,
  },
  subheading: {
    fontSize: fontSizes.subtext,
    fontStyle: `italic`,
    letterSpacing: `0.5px`,
  },
  articleBody: {
    lineHeight: `1.6em`,
    letterSpacing: `1px`,
  },
  darkModeToggle: {
    position: `fixed`,
    right: 10,
    top: 10,
    width: 40,
    height: 40,
    cursor: `pointer`,
    opacity: 0.5,
    '&: hover': {
      opacity: 1,
    },
  },
  darkModeInner: {
    background: `red`,
    display: `relative`,
    '& > svg': {
      width: `100%`,
      height: `100%`,
    },
  },
  SVG: {
    transition: `transform ${animationSpeeds.normal}ms linear`,
    backfaceVisibility: `hidden`,
    position: `absolute`,
    top: 0,
    left: 0,
  },
  SVGHidden: {
    transform: `rotateX(-180deg)`,
  },
}

const lightStyles = {
  backgroundColor: colors.lightYellow,
  siteTitle: {
    color: colors.darkBlue,
  },
  name: {
    color: colors.darkBlue,
  },
  article: {
    color: colors.almostBlack,
  },
}

const darkStyles = {
  backgroundColor: colors.darkGrey,
  siteTitle: {
    color: colors.yellow,
  },
  name: {
    color: colors.yellow,
  },
  article: {
    color: colors.almostWhite,
  },
  SVG: {
    color: `white`,
  },
}

const getCSS = (key, darkMode) => [
  styles[key],
  darkMode ? darkStyles[key] : lightStyles[key],
].filter(style => style)

// special helper to reduce boilerplate
// for dark mode styling
const DARK_MODE_STORAGE_KEY = `DARK_MODE`
const withDarkMode = () => {
  const hasLocalStorage = typeof window === `object` && `localStorage` in window

  const [darkModeString, setDarkMode] = useState(
    hasLocalStorage
      ? JSON.parse(window.localStorage.getItem(DARK_MODE_STORAGE_KEY))
      : false
  )

  const darkMode = JSON.parse(darkModeString)

  const toggleDarkMode = () => setDarkMode(!darkMode)

  useEffect(() => {
    if (hasLocalStorage)
      window.localStorage.setItem(DARK_MODE_STORAGE_KEY, darkMode)
  }, [darkMode])

  return {
    darkMode,
    toggleDarkMode,
  }
}

const Post = ({ data: { mdx: { timeToRead, frontmatter, code }, file: { childImageSharp } } }) => {
  const { darkMode, toggleDarkMode } = withDarkMode()

  return (
    <RootLayout
      title={`${frontmatter.title} - le0.io`}
      description={frontmatter.description}
      backgroundColor={getCSS(`backgroundColor`, darkMode)}
    >
      <MDXProvider components={mdxComponents}>
        <div css={getCSS(`darkModeToggle`)} onClick={toggleDarkMode}>
          <div css={getCSS(`darkModeInner`)}>
            <MoonSVG css={[getCSS(`SVG`, darkMode), darkMode && getCSS(`SVGHidden`, darkMode)]} />
            <SunSVG css={[getCSS(`SVG`, darkMode), !darkMode && getCSS(`SVGHidden`, darkMode)]} />
          </div>
        </div>
        <div css={getCSS(`container`)}>
          <div css={getCSS(`pageHeader`)}>
            <div css={getCSS(`avatar`)} style={{ backgroundImage: `url(${childImageSharp.fixed.src})` }} />
            <div css={getCSS(`siteTitle`, darkMode)}>le0.io</div>
            <div css={getCSS(`name`, darkMode)}>Leopold Wicht</div>
          </div>
          <main>
            <article css={getCSS(`article`, darkMode)}>
              <header css={getCSS(`articleHeader`)}>
                <h1 css={getCSS(`heading`)}>{frontmatter.title}</h1>
                <div css={getCSS(`subheading`)}>{`${frontmatter.date} - ${timeToRead} min read`}</div>
              </header>
              <div css={getCSS(`articleBody`, darkMode)}>
                <MDXRenderer>{code.body}</MDXRenderer>
              </div>
            </article>
          </main>
        </div>
      </MDXProvider>
    </RootLayout>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      id
      timeToRead
      frontmatter {
        title
        date
        description
        keywords
      }
      code {
        body
      }
    }
    file(name: { eq: "leo" }, extension: { eq: "png" }) {
      childImageSharp {
        id
        fixed(width: 100, height: 100, quality: 75) {
          base64
          src
        }
      }
    }
  }
`

export default Post