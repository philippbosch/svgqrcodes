import QRCode from 'qrcode-svg';

export const generateQRCode = (content) => {
  return new QRCode({
    content,
    xmlDeclaration: false,
    ecl: 'L',
    join: true,
  }).svg();
}
