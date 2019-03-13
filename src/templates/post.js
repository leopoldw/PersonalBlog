import React, { memo } from 'react'
import { graphql } from 'gatsby'
import PageConfig from '../PageConfig'
import { MDXProvider } from '@mdx-js/tag'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import Branding from 'components/blog/Branding'
import mdxComponents from 'components/mdx'
import { colors, animationSpeeds, fontSizes } from 'consts/design'
import ContentContainer from 'components/blog/ContentContainer'
import PostMeta from 'components/site/PostMeta'
import useDarkMode from 'hooks/useDarkMode'

const styles = {
  article: {
    transition: `color ${animationSpeeds.normal}ms linear`,
    paddingTop: 100,
    marginBottom: 100,
    color: colors.almostBlack,
  },
  articleDark: {
    color: colors.almostWhite,
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
  articleBody: {
    lineHeight: `1.45em`,
    letterSpacing: `1px`,
  },
}

// TODO: add post back link
// TODO: add post edit link
// TODO: add contact link

// expensive operation, so memoize inner component
const PostContent = memo(({ body }) => (
  <MDXProvider components={mdxComponents}>
    <MDXRenderer>{body}</MDXRenderer>
  </MDXProvider>
))

const Post = ({
  data: { mdx: { timeToRead, frontmatter, code } },
  location: { pathname },
}) => {
  const darkMode = useDarkMode()

  return (
    <>
      <PageConfig
        title={frontmatter.title}
        description={frontmatter.description}
        path={pathname}
      />
      <ContentContainer header={<Branding />}>
        <main>
          <article css={[styles.article, darkMode && styles.articleDark]}>
            <header css={styles.articleHeader}>
              <h1 css={styles.heading}>{frontmatter.title}</h1>
              <PostMeta timeToRead={timeToRead} date={frontmatter.date} />
            </header>
            <div css={styles.articleBody}>
              <PostContent body={code.body} />
            </div>
          </article>
        </main>
        <footer>
          <Branding smaller />
        </footer>
      </ContentContainer>
    </>
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
      }
      code {
        body
      }
    }
  }
`

export default Post