// @vitest-environment node
import { describe, it, expect } from 'vitest';
import sharp from 'sharp';

async function makeTestImage() {
  const img = sharp({ create: { width: 100, height: 50, channels: 3, background: '#0000ff' } });
  const buffer = await img.jpeg().withMetadata({ orientation: 6 }).toBuffer();
  return buffer;
}

describe('thumbnail orientation', () => {
  it('applies EXIF rotation before resizing', async () => {
    const buffer = await makeTestImage();
    const thumb = await sharp(buffer)
      .rotate()
      .resize({ width: 144, height: 144, fit: 'inside' })
      .png()
      .toBuffer();
    const meta = await sharp(thumb).metadata();
    expect(meta.width).toBe(72);
    expect(meta.height).toBe(144);
  });
});
