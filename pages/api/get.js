import { generateQRCode } from "../../utils/qrcode";

const generate = (req, res) => {
  if ("url" in req.query && req.query.url.length) {
    const svg = generateQRCode(req.query.url, req.query.color);
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(svg);
  } else {
    res.statusCode = 404;
    res.send(`Usage: ${Object.keys(req)}`);
  }
};

export default generate;
