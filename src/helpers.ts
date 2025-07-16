export function classNames(
  defaultClasses: string,
  classMap: Record<string, boolean>
): string {
  /**
   * Example usage:
   * classNames('c-button', {
   *   'is-primary': true,
   *   'is-secondary': false,
   *   'is-small': true
   * }) -> 'c-button is-primary is-small'
  */

  const filteredClasses = Object.entries(classMap).reduce((acc, [key, check]) => {
    return check ? `${acc} ${key}`.trim() : acc
  }, '')

  return `${defaultClasses} ${filteredClasses}`.trim()
}

export function getAllEpisodes ({ sortBy = 'latest' } = {}): Array<any> {
  const allPosts = Object.values(import.meta.glob('./pages/episodes/*.{md,mdx}', { eager: true })) 
  const sorter = (a: any, b: any) => {
    const aEpisode = a.frontmatter.episode
    const bEpisode = b.frontmatter.episode
    return sortBy === 'latest'
      ? bEpisode - aEpisode
      : aEpisode - bEpisode
  }

  return allPosts.sort(sorter)
}
