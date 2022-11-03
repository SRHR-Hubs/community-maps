// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const ress = await fetch('http://strapi:1337/api/posts', {
    headers:{
      Authorization: 'Bearer 185f666f47bde9253c04b319cf918bca2f28382ee754abdd295b136db8fd0f0f284aa4b3980a2d3b1fddcfd39f7d11ab2ff6680df1787bb7e388c1177a842050d7be0bc80e653d64f4ff0b4fdfdd02e11cc3c9701cc4cd6a4d3679cd013a41d9c12cf676253146b8e75f71d52f12317a62cbe9aeb437bc7e5503e49068050f82'
    }
  })
  const { data } = await ress.json()
  res.status(200).json(data)
}
