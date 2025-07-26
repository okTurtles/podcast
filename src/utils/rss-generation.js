const generateXMLTag = (tag, attrs = {}, content = '') => {
  const attrsStr = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ').trim()
  return `<${tag}${attrsStr ? ` ${attrsStr}` : ''}>${content}</${tag}>`
}

const generateXMLTags = (tags) => {
  return tags.map(tag => generateXMLTag(tag.name, tag.attrs, tag.content)).join('\n')
}

const xmlRoot = generateXMLTag('rss', {
  version: '2.0',
  'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
  'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
  'xmlns:podcast': 'https://podcastindex.org/namespace/1.0'
}, '@@root_content@@')
const outerMostXMLTemplate = `<?xml version="1.0" encoding="UTF-8"?>${xmlRoot}`
export { outerMostXMLTemplate, generateXMLTag, generateXMLTags }
