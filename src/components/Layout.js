import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

function Header ({ location, title }) {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRoot = location.pathname === rootPath;
  const H = isRoot ? 'h1' : 'h3';
  return (
    <H style={isRoot ? { ...scale(1.5), marginBottom: rhythm(1.5), marginTop: 0 } : { fontFamily: `Montserrat, sans-serif`, marginTop: 0 }}>
      <Link style={{ boxShadow: `none`, textDecoration: `none`, color: `inherit` }} to={`/`}>
        {title}
      </Link>
    </H>
  );
}

export default function Layout ({ location, title, children }) {
  return (
    <div style={{ marginLeft: `auto`, marginRight: `auto`, maxWidth: rhythm(24), padding: `${rhythm(1.5)} ${rhythm(3 / 4)}` }}>
      <Header location={location} title={title} />
      {children}
      <footer>
        View my:
        {' '}
        <a href='https://www.github.com/Jahans3'>Github</a>
        {' '}
        <a href='https://www.twitter.com/josh_jahans'>Twitter</a>
      </footer>
    </div>
  );
}
