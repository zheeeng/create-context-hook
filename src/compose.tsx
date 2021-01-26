import React from 'react'

export const compose = (...[FirstComponent, ...Components]: React.FC[]) => (
  <FirstComponent>
    {!!Components.length && compose(...Components)}
  </FirstComponent>
)
