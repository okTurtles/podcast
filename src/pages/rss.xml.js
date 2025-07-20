import path from 'node:path'
import rss, { pagesGlobToRssItems} from '@astrojs/rss'
import { SITE_TITLE_COMMON, SITE_SUBTITLE_COMMON, SITE_DESCRIPTION_COMMON,
  SITE_AUTHOR, PODCAST_SUMMARY } from '@/constants'

const writeItunesTag = (tag, value = '', attrs = {}) => {
  const attrsStr = Object.entries(attrs).map(([key, value]) => `${key}="${value}"`).join(' ').trim()
  return `<itunes:${tag}${attrsStr ? ` ${attrsStr}` : ''}>${value}</itunes:${tag}>`
}
const objIntoItunesTag = (obj) => {
  return Object.entries(obj).map(([tagName, value]) => writeItunesTag(tagName, value)).join('\n')
}

export async function GET (context) {
  const epPosts = Object.values(import.meta.glob('./episodes/*.{md,mdx}', { eager: true }))
  const joinWithBaseUrl = (...url) => {
    const baseUrl = context.site.toString()
    return baseUrl.endsWith('/')
      ? baseUrl.slice(0, -1) + path.join(...url)
      : baseUrl + path.join(...url)
  }
  const items = []

  for (const post of epPosts) {
    const compiledPostContent = await post.compiledContent()
    const xmlPostContent = `<![CDATA[ ${compiledPostContent} ]]>`

    items.push({
      title: post.frontmatter.title,
      link: post.frontmatter.permalink,
      pubDate: new Date(post.frontmatter.pubDate).toISOString(),
      category: post.frontmatter.tags || [],
      author: SITE_AUTHOR,
      enclosure: {
        url: joinWithBaseUrl(post.frontmatter.src),
        type: post.frontmatter.filetype,
        length: post.frontmatter.filesize,
      },
      description: compiledPostContent,
      content: xmlPostContent,
      customData: [
        objIntoItunesTag({
          episodeType: 'full',
          author: SITE_AUTHOR,
          subtitle: post.frontmatter.subtitle || '',
          duration: post.frontmatter.duration,
          explicit: 'no',
          summary: xmlPostContent,
          keywords: post.frontmatter.tags.join(', ')
        }),
        writeItunesTag('image', '', { href: joinWithBaseUrl('/images/episode-covers/', post.frontmatter.coverImage) })
      ].join('\n')
    })
  }

  return rss({
    title: SITE_TITLE_COMMON,
    description: SITE_DESCRIPTION_COMMON,
    site: context.site,
    xmlns: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    },
    customData: [
      '<language>en-us</language>',
      `<copyright>${SITE_AUTHOR}</copyright>`,
      objIntoItunesTag({
        type: 'episodic',
        subtitle: SITE_SUBTITLE_COMMON,
        author: SITE_AUTHOR,
        summary: PODCAST_SUMMARY,
        explicit: 'no',
        owner: objIntoItunesTag({
          name: SITE_AUTHOR,
          email: 'hi@okturtles.org'
        })
      }),
      writeItunesTag('image', '', { href: joinWithBaseUrl('/images/turtle.png') }),
      writeItunesTag('category', '', { text: 'Technology' }),
      writeItunesTag('category', '', { text: 'Society & Culture' }),
      writeItunesTag('category', '', { text: 'Education' })
    ].join('\n'),
    items
  })
}
