import sanitizeHtml from 'sanitize-html'
import removeMd from 'remove-markdown'

type TagEntry = {
  name: string,
  attrs?: Record<string, any>,
  content?: string,
  noEscape?: boolean
}

type ItunesTagEntry = {
  tagName: string,
  attrs?: Record<string, any>,
  value?: string,
  noEscape?: boolean
}

const escapeXML = (content: string): string => {
  if (typeof content !== 'string') return content
  // Order matters! Replace & first to avoid double-escaping
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const generateXMLTag = (tag: string, attrs: Record<string, any> = {}, content: string = '', noEscape: boolean = false): string => {
  const attrsStr = Object.entries(attrs)
    .map(([key, value]) => `${key}="${noEscape ? value : escapeXML(value)}"`)
    .join(' ').trim()

  // Don't escape content if it contains CDATA
  const escapedContent = content.includes('<![CDATA[')
    ? content
    : noEscape
      ? content
      : escapeXML(content)
  return `<${tag}${attrsStr ? ` ${attrsStr}` : ''}>${escapedContent}</${tag}>`
}

const generateXMLTags = (tags: TagEntry[]): string => {
  return tags.map(tag => generateXMLTag(tag.name, tag.attrs, tag.content, tag.noEscape)).join('\n')
}

const writeItunesTag = (tag: string,  attrs: Record<string, any> = {}, value: string = '', noEscape: boolean = false): string => {
  return generateXMLTag(`itunes:${tag}`, attrs, value, noEscape)
}

const objIntoItunesTag = (obj: Record<string, ItunesTagEntry>): string => {
  return Object.entries(obj)
    .map(([tagName, props]) => writeItunesTag(tagName, props.attrs || {}, props.value || '', props.noEscape))
    .join('\n')
}

const sanitizePostHTML = (content: string): string => {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes
    }
  })
}

const mdToPlainText = (markdown: string): string => {
  const md = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)') // [text](url) -> text (url)

  return removeMd(md, {
    stripListLeaders: true,
    listUnicodeChar: '',
    gfm: true,
    useImgAltText: false
  }).trim()
}

// https://github.com/Podcast-Standards-Project/PSP-1-Podcast-RSS-Specification?tab=readme-ov-file#required-rss-namespace-declarations
const rssXMLWrapper = (content: string): string => {
  const rssRoot = generateXMLTag(
    'rss',
    {
      version: '2.0',
      'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      'xmlns:podcast': 'https://podcastindex.org/namespace/1.0',
      'xmlns:atom': 'http://www.w3.org/2005/Atom',
      'xmlns:content': 'http://purl.org/rss/1.0/modules/content/'
    },
    generateXMLTag('channel', {}, content)
  )

  return `<?xml version="1.0" encoding="UTF-8"?>\n${rssRoot}`
}

export {
  rssXMLWrapper,
  generateXMLTag,
  generateXMLTags,
  writeItunesTag,
  objIntoItunesTag,
  sanitizePostHTML,
  mdToPlainText
}
