import type { MarkdownInstance } from 'astro'
import type { Episode, TagDictionary } from './types'

type EpisodeModule = MarkdownInstance<Episode>
type EpisodeEntry = EpisodeModule & { details: Episode }

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

export function uniqArray<T> (arr: T[]): T[] {
  return Array.from(new Set(arr))
}

export async function getAllEpisodes ({ sortBy = 'latest' } = {}): Promise<EpisodeEntry[]> {
  const allFetched = Object.values(import.meta.glob<EpisodeModule>('./pages/episodes/*.{md,mdx}', { eager: true }))
  const allPosts: EpisodeEntry[] = []
  for (const post of allFetched) {
    allPosts.push({
      ...post,
      details: {
        ...post.frontmatter,
        epContent: await post.compiledContent(),
      }
    })
  }

  const sorter = (a: EpisodeEntry, b: EpisodeEntry) => {
    const aEpisode = a.frontmatter.episode
    const bEpisode = b.frontmatter.episode
    return sortBy === 'latest'
      ? bEpisode - aEpisode
      : aEpisode - bEpisode
  }

  return allPosts.sort(sorter)
}

export async function getAllEpisodeTags (asDictionary: boolean = false): Promise<string[] | TagDictionary> {
  const allEpisodesTags = (await getAllEpisodes()).map(ep => ep.frontmatter.tags || [])

  if (asDictionary) {
    const flattenedTags = allEpisodesTags.flat()
    const dict: TagDictionary = {}
    for (const tag of flattenedTags) {
      const firstLetter = tag.charAt(0).toUpperCase()
      if (!dict[firstLetter]) {
        dict[firstLetter] = {}
      }
      dict[firstLetter][tag] = (dict[firstLetter][tag] || 0) + 1
    }
    return dict
  } else {
    return allEpisodesTags.reduce((allTags, tags) => uniqArray([...allTags, ...tags]), [] as string[]).sort()
  }
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
  const s = parseInt(parts[len - 1])
  const m = parseInt(parts[len - 2])
  const h = len === 3 ? parseInt(parts[0]) : 0

  return `${h ? `${h}h` : ''} ${m}m ${s}s`.trim()
}

export function randomHexString (length: number) {
  let result = ''
  while (result.length < length) {
    result += Math.floor(Math.random() * 16).toString(16)
  }

  return result
}

export function whiteSpaceToUnderscore (str: string): string {
  return str.trim().replace(/\s+/g, '_')
}

export function getTagLink (tag: string): string {
  return `/tag/${whiteSpaceToUnderscore(tag)}`
}
