import fs from 'fs'

export default async function handler(req: any, res: any) {
  const { slug } = req.query
  console.log('slug', slug)
  const stuff = slug.join('')
  console.log(stuff)
  const uri = decodeURIComponent(slug)
  const prefix = uri.includes('\\') ? '' : '/'
  const path = `${uri}`
  console.log('path', path)
  try {
    const text = fs.readFileSync(`${path}`, { encoding: 'utf-8' })
    res.end(`${text}`)
  } catch (e) {
    res.end(`Oopsie Whoopsie! We did a fucky wucky!`)
    console.log(e)
  }
}
