import React from 'react'
import { graphql } from 'gatsby'
// import { MDXRenderer } from 'gatsby-mdx'

const IndexPage = ({
  data: { allMdx: { edges } },
  ...props
}) => (
  <>
    {edges.map(({ node: post }) => (
      <h1 key={post.key} c={console.log(props)}>{post.frontmatter.title}</h1>
      // <MDXRenderer key={post.id}>{post.node.code.body}</MDXRenderer>
    ))}
  </>
)

export default IndexPage

export const query = graphql`
  query {
    allMdx {
      edges {
        node {
          id
          frontmatter {
            title
          }
        }
      }
    }
  }
`