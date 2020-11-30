import QRCode from 'qrcode-svg';

export const generateQRCode = (content, color) => {
  return new QRCode({
    content,
    xmlDeclaration: false,
    ecl: 'L',
    join: true,
    color: color || '#000000',
    background: 'transparent',
  }).svg();
}
