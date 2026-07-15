import { isDoubanImageUrl, processImageUrl } from './utils';

describe('processImageUrl', () => {
  beforeEach(() => {
    localStorage.clear();
    (
      window as typeof window & { RUNTIME_CONFIG?: { IMAGE_PROXY?: string } }
    ).RUNTIME_CONFIG = { IMAGE_PROXY: '' };
  });

  it('uses the built-in proxy for Douban poster URLs', () => {
    const poster =
      'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2934049524.jpg';

    expect(processImageUrl(poster)).toBe(
      `/api/image-proxy?url=${encodeURIComponent(poster)}`
    );
  });

  it('keeps non-Douban image URLs unchanged by default', () => {
    const poster = 'https://example.com/poster.jpg';

    expect(processImageUrl(poster)).toBe(poster);
  });

  it('keeps an explicitly configured custom proxy as the first choice', () => {
    const poster = 'https://img1.doubanio.com/poster.jpg';
    localStorage.setItem('enableImageProxy', 'true');
    localStorage.setItem('imageProxyUrl', 'https://proxy.example/?url=');

    expect(processImageUrl(poster)).toBe(
      `https://proxy.example/?url=${encodeURIComponent(poster)}`
    );
  });

  it('recognizes only Douban HTTP image hosts', () => {
    expect(isDoubanImageUrl('https://img3.doubanio.com/a.jpg')).toBe(true);
    expect(isDoubanImageUrl('http://img1.douban.com/a.jpg')).toBe(true);
    expect(isDoubanImageUrl('https://doubanio.com.evil.test/a.jpg')).toBe(
      false
    );
    expect(isDoubanImageUrl('data:image/png;base64,abc')).toBe(false);
  });
});
