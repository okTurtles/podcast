import path from 'node:path'
import { rssXMLWrapper, generateXMLTag, writeItunesTag,
  objIntoItunesTag, sanitizePostHTML, mdToPlainText } from '@/utils/rss-generation.ts'
import {
  SITE_TITLE_COMMON, SITE_SUBTITLE_COMMON, SITE_DESCRIPTION_COMMON,
  SITE_AUTHOR, SITE_AUTHOR_EMAIL, PODCAST_SUMMARY, SITE_URL, PODCAST_CATEGORIES
} from '@/constants.ts'

// NOTE - This RSS feed generator script was written based on the guidelines in the following resources:
// Required tags in RSS feed of a podcast: https://help.apple.com/itc/podcasts_connect/#/itcb54353390
// Podcast RSS feed requirements for Apple Podcasts: https://podcasters.apple.com/support/823-podcast-requirements

export async function GET (context) {
  const joinWithBaseUrl = (...url) => {
    return new URL(path.join(...url), SITE_URL).toString()
  }

  // 1. Generate the <item /> tags from the episode posts and their content.
  const items = []
  const epPosts = Object.values(import.meta.glob('./episodes/*.{md,mdx}', { eager: true }))
    .sort((a, b) => Number(b.frontmatter.episode) - Number(a.frontmatter.episode))

  for (const post of epPosts) {
    const compiledPostContent = await post.compiledContent()
    const sanitizedPostContent = sanitizePostHTML(compiledPostContent)

    // For content:encoded, wrap in CDATA
    const xmlPostContent = `<![CDATA[ ${sanitizedPostContent} ]]>`

    // For <description> tag, convert markdown to plain text.
    const rawPostContent = await post.rawContent()
    const plainTextContent = mdToPlainText(rawPostContent)

    const currentItemContent = [
      generateXMLTag('title', {}, post.frontmatter.title),
      generateXMLTag('link', {}, joinWithBaseUrl(post.frontmatter.permalink)),
      generateXMLTag('guid', { isPermaLink: false }, post.frontmatter.guid),
      generateXMLTag('pubDate', {}, new Date(post.frontmatter.pubDate).toUTCString()),
      generateXMLTag('author', {}, SITE_AUTHOR),
      generateXMLTag('enclosure', {
        url: joinWithBaseUrl(post.frontmatter.src),
        type: post.frontmatter.filetype,
        length: post.frontmatter.filesize,
      }, ''),
      generateXMLTag('description', {}, plainTextContent),
      generateXMLTag('content:encoded', {}, xmlPostContent),
      objIntoItunesTag({
        episodeType: { value: 'full' },
        title: { value: post.frontmatter.title },
        subtitle: { value: post.frontmatter.subtitle || '' },
        author: { value: SITE_AUTHOR },
        duration: { value: post.frontmatter.duration },
        explicit: { value: 'no' },
        keywords: { value: post.frontmatter.tags.join(', ') },
        summary: { value: xmlPostContent }
      }),
      writeItunesTag('image', { href: post.frontmatter.coverImage
        ? joinWithBaseUrl('/images/episode-covers/', post.frontmatter.coverImage)
        : joinWithBaseUrl('/images/show-cover.jpg')
      }, '')
    ].join('\n')

    items.push(generateXMLTag('item', {}, currentItemContent))
  }

  // 2. Generate the <channel /> tag and its content.
  const channelContent = [
    generateXMLTag('generator', {}, 'okTurtles RSS'),
    generateXMLTag('title', {}, SITE_TITLE_COMMON),
    generateXMLTag('link', {}, SITE_URL),
    generateXMLTag('pubDate', {}, new Date().toUTCString()),
    generateXMLTag('lastBuildDate', {}, new Date().toUTCString()),
    generateXMLTag('description', {}, SITE_DESCRIPTION_COMMON),
    generateXMLTag('language', {}, 'en-us'),
    generateXMLTag('copyright', {}, `© ${new Date().getFullYear()} ${SITE_AUTHOR} Inc.`),
    objIntoItunesTag({
      type: { value: 'episodic' },
      subtitle: { value: SITE_SUBTITLE_COMMON },
      author: { value: SITE_AUTHOR },
      summary: { value: PODCAST_SUMMARY },
      explicit: { value: 'false' },
      owner: {
        value: objIntoItunesTag({
          name: { value: SITE_AUTHOR },
          email: { value: SITE_AUTHOR_EMAIL }
        }),
        noEscape: true
      }
    }),
    writeItunesTag('image', { href: joinWithBaseUrl('/images/show-cover.jpg') }, ''),
    ...PODCAST_CATEGORIES.map(category => writeItunesTag('category', { text: category }, '')),
    ...items
  ].join('\n')

  const output = new Response(
    rssXMLWrapper(channelContent),
    {
      headers: {
        'Content-Type': 'application/xml',
      }
    }
  )

  return output
}
