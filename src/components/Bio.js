import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

import { rhythm } from '../utils/typography'

function Bio () {
  return (
    <StaticQuery
      query={bioQuery}
      render={({
        site: { siteMetadata: { author, social: { twitter, github } } },
        avatar: { childImageSharp: { fixed: avatar } }
      }) => (
        <div style={{ display: `flex`, alignItems: 'center', marginBottom: rhythm(2.5) }}>
          <Image
            fixed={avatar}
            alt={author}
            style={{
              marginRight: rhythm(1 / 2),
              marginBottom: 0,
              borderRadius: `100%`,
              objectFit: 'contain',
              width: 120,
              filter: 'brightness(1.5) grayscale(100%)'
            }}
          />
          <p style={{ marginBottom: 0 }}>
            My name is <strong>{author}</strong> and this is my blog. I write about JavaScript and React.
            <br />
            <OutboundLink href={`https://twitter.com/${twitter}`} style={{ marginTop: 50 }}>
              Follow me on Twitter
            </OutboundLink>
          </p>
        </div>
      )}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/me.png/" }) {
      childImageSharp {
        fixed(width: 100, height: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter,
          github
        }
      }
    }
  }
`

export default Bio
