'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// يولّد QR من الرابط المنشور الفعلي (عنوان الموقع الحالي + /join)
export function useJoinUrl() {
  const [url, setUrl] = useState('');
  useEffect(() => { setUrl(window.location.origin + '/join'); }, []);
  return url;
}

export default function QR({ size = 220, dark = '#1a0530', light = '#ffffff' }) {
  const url = useJoinUrl();
  const [svg, setSvg] = useState('');
  useEffect(() => {
    if (!url) return;
    QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark, light } })
      .then(setSvg).catch(() => setSvg(''));
  }, [url, dark, light]);
  return (
    <div style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} aria-label={url} />
  );
}

export function shortUrl(url) {
  return (url || '').replace(/^https?:\/\//, '');
}
