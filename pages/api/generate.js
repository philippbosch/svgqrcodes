import { generateQRCode } from '../../utils/qrcode';

const generate = (req, res) => {
  if ('url' in req.query && req.query.url.length) {
    const svg = generateQRCode(req.query.url);
    res.statusCode = 200
    res.json({ success:true, svg, url: req.query.url })
  } else {
    res.statusCode = 404;
    res.json({ success: false })
  };
}

export default generate;
