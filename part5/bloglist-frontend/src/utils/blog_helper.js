const compareBlog = (blog1, blog2) => {
  if (blog1.likes < blog2.likes) {
    return 1
  }
  if (blog1.likes > blog2.likes) {
    return -1
  }
  return 0
}

export default { compareBlog }