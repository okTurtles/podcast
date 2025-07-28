import sanitizeHtml from 'sanitize-html'
import removeMd from 'remove-markdown'

type TagEntry = {
  name: string,
  attrs?: Record<string, any>,
  content?: string
}

type ItunesTagEntry = {
  tagName: string,
  attrs?: Record<string, any>,
  value?: string
}

const escapeXML = (content: string): string => {
  if (typeof content !== 'string') return content

  const escapeDict = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }

  for (const [key, value] of Object.entries(escapeDict)) {
    content = content.replace(new RegExp(key, 'g'), value)
  }

  return content
}

const generateXMLTag = (tag: string, attrs: Record<string, any> = {}, content: string = ''): string => {
  const attrsStr = Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeXML(value)}"`)
    .join(' ').trim()

  // Don't escape content if it contains CDATA
  const escapedContent = content.includes('<![CDATA[') ? content : escapeXML(content)
  return `<${tag}${attrsStr ? ` ${attrsStr}` : ''}>${escapedContent}</${tag}>`
}

const generateXMLTags = (tags: TagEntry[]): string => {
  return tags.map(tag => generateXMLTag(tag.name, tag.attrs, tag.content)).join('\n')
}

const writeItunesTag = (tag: string,  attrs: Record<string, any> = {}, value: string = ''): string => {
  return generateXMLTag(`itunes:${tag}`, attrs, value)
}

const objIntoItunesTag = (obj: Record<string, ItunesTagEntry>): string => {
  return Object.entries(obj)
    .map(([tagName, props]) => writeItunesTag(tagName, props.attrs || {}, props.value || ''))
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

const rssXMLWrapper = (content: string): string => {
  const rssRoot = generateXMLTag(
    'rss', 
    {
      version: '2.0',
      'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
      'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      'xmlns:podcast': 'https://podcastindex.org/namespace/1.0'
    },
    generateXMLTag('channel', {}, content)
  )

  return `<?xml version="1.0" encoding="UTF-8"?>${rssRoot}`
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
