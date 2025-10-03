import React from 'react'

function Container({children, className = ''}) {
  return <div className={`w-full max-w-none px-0 ${className}`}>{children}</div>;
}

export default Container