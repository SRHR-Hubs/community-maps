// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const ress = await fetch('http://strapi:1337/api/posts', {
    headers:{
      Authorization: 'Bearer ' + process.env.STRAPI_LOCAL_KEY
    }
  })
  const { data } = await ress.json()
  res.status(200).json(data)
}
