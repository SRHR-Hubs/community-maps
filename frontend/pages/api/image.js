import cloudinary from "../../lib/cloudinary";

export default async function handler(req, res) {
  res.status(200).json(
    await cloudinary.url("cld-sample-5", {
      transformation: [{ dpr: "auto", responsive: true, width: "auto" }],
    })
  );
}
