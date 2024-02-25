import sharp from "sharp";

export function extractImageUrlsFromMarkdown(markdown: string) {
  const imageUrls = [];

  const markdownImageUrlPattern = /(src="|\!\[.*?\]\()(.*?)(\)|")/g;

  let match: ReturnType<RegExp["exec"]> = null;

  while ((match = markdownImageUrlPattern.exec(markdown)) !== null) {
    imageUrls.push(match[2]);
  }

  return imageUrls;
}

export async function getImageUrlToPreviewImageData(
  urls: string[]
): Promise<Map<string, PreviewImage>> {
  const previewImages: Map<string, PreviewImage> = new Map();

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        cache: "force-cache",
      });

      const arrayBuffer = await response.arrayBuffer();

      /**
       * 테스트 환경에서 `jest-fetch-mock`을 사용하였을 때,
       * ArrayBuffer 객체가 올바르게 인식되지 않는 문제가 있어
       * Buffer로 한번 더 변경해주었다.
       */
      const image = sharp(Buffer.from(arrayBuffer));

      const previewImage = await image
        .toFormat("jpeg")
        .jpeg({ quality: 1 })
        .toBuffer({ resolveWithObject: true });

      const base64 = previewImage.data.toString("base64");

      previewImages.set(url, {
        width: previewImage.info.width,
        height: previewImage.info.height,
        base64: `data:image/jpeg;base64,${base64}`,
      });
    } catch (e) {
      /**
       * 예러가 발생하는 경우
       *
       * 예 - iframe의 src를 가져오는 경우
       */
    }
  }

  return previewImages;
}
