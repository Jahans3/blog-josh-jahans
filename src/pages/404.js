import React from 'react'

import Layout from '../components/Layout'
import SEO from '../components/seo'

export default function NotFoundPage ({
  data: { site: { siteMetadata: { title: siteTitle } } } ,
  location
}) {
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="404: Not Found" />
      <h1>Oopsie doopise</h1>
      <p>That's a 404: not found.</p>
    </Layout>
  );
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
