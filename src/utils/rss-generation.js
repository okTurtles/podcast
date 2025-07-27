import sanitizeHtml from 'sanitize-html'
import removeMd from 'remove-markdown'

const generateXMLTag = (tag, attrs = {}, content = '') => {
  const attrsStr = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ').trim()
  return `<${tag}${attrsStr ? ` ${attrsStr}` : ''}>${content}</${tag}>`
}

const generateXMLTags = (tags) => {
  return tags.map(tag => generateXMLTag(tag.name, tag.attrs, tag.content)).join('\n')
}

const writeItunesTag = (tag,  attrs = {}, value = '') => {
  return generateXMLTag(`itunes:${tag}`, attrs, value)
}

const objIntoItunesTag = (obj) => {
  return Object.entries(obj)
    .map(([tagName, props]) => writeItunesTag(tagName, props.attrs || {}, props.value || ''))
    .join('\n')
}

const sanitizePostHTML = (content) => {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes
    }
  })
}

const mdToPlainText = (markdown) => {
  const md = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)') // [text](url) -> text (url)

  return removeMd(md, {
    stripListLeaders: true,
    listUnicodeChar: '',
    gfm: true,
    useImgAltText: false
  }).trim()
}

const rssRoot = generateXMLTag(
  'rss', 
  {
    version: '2.0',
    encoding: 'UTF-8',
    'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
    'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    'xmlns:podcast': 'https://podcastindex.org/namespace/1.0'
  },
  generateXMLTag('channel', {}, '@@channel_content@@'))
const outerMostXMLTemplate = `<?xml version="1.0" encoding="UTF-8"?>${rssRoot}`

export {
  outerMostXMLTemplate,
  generateXMLTag,
  generateXMLTags,
  writeItunesTag,
  objIntoItunesTag,
  sanitizePostHTML,
  mdToPlainText
}
