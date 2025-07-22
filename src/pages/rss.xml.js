import path from 'node:path'
import rss from '@astrojs/rss'
import sanitizeHtml from 'sanitize-html'
import {
  SITE_TITLE_COMMON, SITE_SUBTITLE_COMMON, SITE_DESCRIPTION_COMMON,
  SITE_AUTHOR, PODCAST_SUMMARY, SITE_URL
} from '@/constants'

// NOTE - This RSS feed generator script was written based on the guidelines in the following resources:
// Required tags in RSS feed of a podcast: https://help.apple.com/itc/podcasts_connect/#/itcb54353390
// Podcast RSS feed requirements for Apple Podcasts: https://podcasters.apple.com/support/823-podcast-requirements

const sanitizePostHTML = (content) => {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
  })
}

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
    return new URL(path.join(...url), SITE_URL).toString()
  }
  const items = []

  for (const post of epPosts) {
    const compiledPostContent = await post.compiledContent()
    const sanitizedPostContent = sanitizePostHTML(compiledPostContent)
    const xmlPostContent = `<![CDATA[ ${sanitizedPostContent} ]]>`

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
      description: xmlPostContent,
      content: xmlPostContent,
      customData: [
        // custom data for the episode.
        objIntoItunesTag({
          episodeType: 'full',
          author: SITE_AUTHOR,
          title: post.frontmatter.title,
          subtitle: post.frontmatter.subtitle || '',
          duration: post.frontmatter.duration,
          explicit: 'no',
          keywords: post.frontmatter.tags.join(', ')
        }),
        // NOTE: <itunes:summary> tag is not necessary to add. it's used nowhere for the presentation according to https://help.apple.com/itc/podcasts_connect/#/itcb54353390
        // writeItunesTag('summary', sanitizedPostContent),
        writeItunesTag('image', '', {
          href: post.frontmatter.coverImage
            ? joinWithBaseUrl('/images/episode-covers/', post.frontmatter.coverImage)
            : joinWithBaseUrl('/images/show-cover.jpg')
        })
      ].join('\n')
    })
  }

  return rss({
    title: SITE_TITLE_COMMON,
    description: SITE_DESCRIPTION_COMMON,
    site: context.site,
    xmlns: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      content: 'http://purl.org/rss/1.0/modules/content/',
      podcast: 'https://podcastindex.org/namespace/1.0'
    },
    customData: [
      // custom data for the show.
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
      writeItunesTag('image', '', { href: joinWithBaseUrl('/images/show-cover.jpg') }),
      writeItunesTag('category', '', { text: 'Technology' }),
      writeItunesTag('category', '', { text: 'Society &amp; Culture' }),
      writeItunesTag('category', '', { text: 'Education' })
    ].join('\n'),
    items
  })
}
