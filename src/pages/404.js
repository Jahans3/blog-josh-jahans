import React from 'react'

import Layout from '../components/Layout'
import SEO from '../components/seo'

export default function NotFoundPage ({ data, location }) {
  const siteTitle = data.site.siteMetadata.title;
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="404: Not Found" />
      <h1>Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
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
