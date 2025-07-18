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

export function formatPubDate (dateStr: string): string {
  const date = new Date(dateStr)

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDuration (duration: string): string {
  if (!/^(\d{2}:)?\d{2}:\d{2}$/.test(duration)) {
    console.error('Invalid duration format. Expected MM:SS or HH:MM:SS')
    return ''
  }

  const parts = duration.split(':')
  const len = parts.length
  let h = 0, m = 0, s = 0

  s = parseInt(parts[len - 1])
  m = parseInt(parts[len - 2])

  if (len === 3) {
    h = parseInt(parts[0])
  }
  return `${h ? `${h}h` : ''} ${m}m ${s}s`.trim()
}
