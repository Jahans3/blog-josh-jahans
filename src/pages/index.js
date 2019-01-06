import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm } from '../utils/typography'

export default function BlogIndex ({
  location,
  data: {
    site: { siteMetadata: { title: siteTitle } },
    allMarkdownRemark: { edges: posts }
  }
}) {
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title='All posts' keywords={['josh jahans', 'jahans', 'blog', 'gatsby', 'javascript', 'react']} />
      <Bio />
      {posts.map(({ node: { excerpt, fields: { slug }, frontmatter: { title = slug, date } } }) => (
        <div key={slug}>
          <h3 style={{ marginBottom: rhythm(1 / 4) }}>
            <Link style={{ boxShadow: 'none' }} to={slug}>
              {title}
            </Link>
          </h3>
          <small>{date}</small>
          <p dangerouslySetInnerHTML={{ __html: excerpt }} />
        </div>
      ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`;
