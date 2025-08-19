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

export function uniqArray (arr: Array<any>): Array<any> {
  return Array.from(new Set(arr))
}

export async function getAllEpisodes ({ sortBy = 'latest' } = {}): Promise<Array<any>> {
  const allFetched = Object.values(import.meta.glob('./pages/episodes/*.{md,mdx}', { eager: true }))
  const allPosts = []
  for (const post of allFetched) {
    allPosts.push({
      ...(post as any),
      details: {
        ...(post as any).frontmatter,
        epContent: await (post as any).compiledContent(),
      }
    })
  }

  const sorter = (a: any, b: any) => {
    const aEpisode = a.frontmatter.episode
    const bEpisode = b.frontmatter.episode
    return sortBy === 'latest'
      ? bEpisode - aEpisode
      : aEpisode - bEpisode
  }

  return allPosts.sort(sorter)
}

export async function getAllEpisodeTags (): Promise<string[]> {
  const allEpisodes = await getAllEpisodes()
  return allEpisodes.map(ep => ep.frontmatter.tags || [])
    .reduce((allTags, tags) => uniqArray([...allTags, ...tags]), [])
    .sort()
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

export function randomHexString (length: number) {
  let result = ''
  while (result.length < length) {
    result += Math.floor(Math.random() * 16).toString(16)
  }

  return result
}
