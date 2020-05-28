import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

import { projects } from '../../../../build-config'

const List = styled.ul`
  padding: 0;
  list-style: none;
`
const Item = styled.li`
  list-style: none;
`

const StyledLink = styled(Link)`
  color: #00aaee;
  text-decoration: none;
`

function Home() {
  const packages = projects.filter(({ pathPrefix }) => pathPrefix !== '/')
  return (
    <div>
      <h1>Home</h1>
      <List>
        {packages.map(({ name, pathPrefix }) => (
          <Item key={pathPrefix}>
            <StyledLink to={pathPrefix}>{name}</StyledLink>
          </Item>
        ))}
      </List>
    </div>
  )
}

export default Home
