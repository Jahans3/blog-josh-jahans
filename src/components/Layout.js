import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

function Header ({ location, title }) {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRoot = location.pathname === rootPath;
  const H = isRoot ? 'h1' : 'h3';
  return (
    <H
      style={isRoot
        ? { ...scale(1.5), marginBottom: rhythm(1.5), marginTop: 0 }
        : { fontFamily: `Montserrat, sans-serif`, marginTop: 0, color: '#007acc' }
      }
    >
      <Link style={{ boxShadow: `none`, textDecoration: `none`, color: `inherit` }} to={`/`}>
        {title}
      </Link>
    </H>
  );
}

export default function Layout ({ location, title, children }) {
  return (
    <StaticQuery
      query={socialQuery}
      render={({ site: { siteMetadata: { social: { twitter, github } } } }) => (
        <div style={{ marginLeft: `auto`, marginRight: `auto`, maxWidth: rhythm(24), padding: `${rhythm(1.5)} ${rhythm(3 / 4)}` }}>
          <Header location={location} title={title} />
          {children}
          <footer>
            View my:
            {' '}
            <a href={`https://www.github.com/${github}`}>Github</a>
            {' '}
            <a href={`https://www.twitter.com/${twitter}`}>Twitter</a>
            <span style={{ float: 'right' }}>
          Check out the <a href='/rss.xml'>RSS Feed</a>
        </span>
          </footer>
        </div>
      )}
    />
  );
}

const socialQuery = graphql`
  query SocialQuery {
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
