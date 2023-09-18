import { blobToArrayBuffer } from 'blob-util';
import type { LoadImageResult } from 'blueimp-load-image';
import loadImage from 'blueimp-load-image';
import { encode } from 'blurhash';

import {
  AttachmentType,
  InMemoryAttachmentDraftType,
} from '~/utils/attachment';
import { IMAGE_JPEG, isGif, MIMEType, stringToMIMEType } from '~/utils/MIME';

type Input = Parameters<typeof loadImage>[0];

type MIMETypeSupportMap = Record<string, boolean>;

const SUPPORTED_IMAGE_MIME_TYPES: MIMETypeSupportMap = {
  'image/avif': true,
  'image/bmp': true,
  'image/gif': true,
  'image/jpeg': true,
  // No need to support SVG
  'image/svg+xml': false,
  'image/webp': true,
  'image/x-xbitmap': true,
  // ICO
  'image/vnd.microsoft.icon': true,
  'image/ico': true,
  'image/icon': true,
  'image/x-icon': true,
  // PNG
  'image/apng': true,
  'image/png': true,
};

export const isImageTypeSupported = (mimeType: string): boolean =>
  SUPPORTED_IMAGE_MIME_TYPES[mimeType] === true;

export function isImageAttachment(
  attachment?: Pick<AttachmentType, 'contentType'>
): boolean {
  return Boolean(
    attachment?.contentType && isImageTypeSupported(attachment.contentType)
  );
}

async function getCanvasBlobAsJPEG(
  image: HTMLCanvasElement,
  dimensions: number,
  quality: number
): Promise<Blob> {
  const canvas = loadImage.scale(image, {
    canvas: true,
    maxHeight: dimensions,
    maxWidth: dimensions,
  });
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('image not a canvas');
  }
  return canvasToBlob(canvas, IMAGE_JPEG, quality);
}

const MiB = 1024 * 1024;
const DEFAULT_LEVEL_DATA = {
  maxDimensions: 1600,
  quality: 0.7,
  size: MiB,
  thresholdSize: 0.2 * MiB,
};
const SCALABLE_DIMENSIONS = [3072, 2048, 1600, 1024, 768];
const MIN_DIMENSIONS = 512;

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType = IMAGE_JPEG,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Couldn't convert the canvas to a Blob"));
        }
      },
      mimeType,
      quality
    )
  );
}

export function canBeTranscoded(
  attachment?: Pick<AttachmentType, 'contentType'>
): boolean {
  return Boolean(
    attachment &&
      isImageAttachment(attachment) &&
      !isGif(attachment.contentType)
  );
}

export const imageToBlurHash = async (input: Input): Promise<string> => {
  const { data, width, height } = await loadImageData(input);
  // 4 horizontal components and 3 vertical components
  return encode(data, width, height, 4, 3);
};

const loadImageData = async (input: Input): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    loadImage(
      input,
      (canvasOrError) => {
        if (canvasOrError instanceof Event && canvasOrError.type === 'error') {
          const processError = new Error(
            'imageToBlurHash: Failed to process image',
            { cause: canvasOrError }
          );
          reject(processError);
          return;
        }

        if (!(canvasOrError instanceof HTMLCanvasElement)) {
          reject(new Error('imageToBlurHash: result is not a canvas'));
          return;
        }

        const context = canvasOrError.getContext('2d');
        if (!context) {
          reject(
            new Error(
              'imageToBlurHash: cannot get CanvasRenderingContext2D from canvas'
            )
          );
          return;
        }

        resolve(
          context.getImageData(0, 0, canvasOrError.width, canvasOrError.height)
        );
      },
      // Calculating the blurhash on large images is a long-running and
      // synchronous operation, so here we ensure the images are a reasonable
      // size before calculating the blurhash. iOS uses a max size of 200x200
      // and Android uses a max size of 1/16 the original size. 200x200 is
      // easier for us.
      { canvas: true, orientation: true, maxWidth: 200, maxHeight: 200 }
    );
  });
};

export async function handleImageAttachment(
  file: File
): Promise<InMemoryAttachmentDraftType> {
  const processedFile: File | Blob = file;

  const {
    contentType,
    file: resizedBlob,
    fileName,
  } = await autoScale({
    contentType: stringToMIMEType(file.type),
    fileName: file.name,
    file: processedFile,
  });

  const data = await blobToArrayBuffer(resizedBlob);
  const blurHash = await imageToBlurHash(resizedBlob);

  return {
    blurHash,
    contentType,
    data: new Uint8Array(data),
    fileName: fileName || file.name,
    path: file.name,
    pending: false,
    size: data.byteLength,
  };
}

export async function autoScale({
  contentType,
  file,
  fileName,
}: {
  contentType: MIMEType;
  file: File | Blob;
  fileName: string;
}): Promise<{
  contentType: MIMEType;
  file: Blob;
  fileName: string;
}> {
  if (!canBeTranscoded({ contentType })) {
    return { contentType, file, fileName };
  }

  const { blob, contentType: newContentType } = await scaleImageToLevel(
    file,
    contentType,
    true
  );

  if (newContentType !== IMAGE_JPEG) {
    return {
      contentType,
      file: blob,
      fileName,
    };
  }

  return {
    contentType: IMAGE_JPEG,
    file: blob,
    fileName: `${fileName}.jpg`,
  };
}

export async function scaleImageToLevel(
  fileOrBlobOrURL: File | Blob,
  contentType: MIMEType,
  sendAsHighQuality?: boolean
): Promise<{
  blob: Blob;
  contentType: MIMEType;
}> {
  let data: LoadImageResult;
  try {
    data = await loadImage(fileOrBlobOrURL, {
      canvas: true,
      orientation: true,
      meta: true, // Check if we need to strip EXIF data
    });
    if (!(data.image instanceof HTMLCanvasElement)) {
      throw new Error('image not a canvas');
    }
  } catch (cause) {
    const error = new Error('scaleImageToLevel: Failed to process image', {
      cause,
    });
    throw error;
  }

  const { maxDimensions, quality, size, thresholdSize } = DEFAULT_LEVEL_DATA;

  if (fileOrBlobOrURL.size <= thresholdSize) {
    // Always encode through canvas as a temporary fix for a library bug
    const blob: Blob = await canvasToBlob(data.image, contentType);
    return {
      blob,
      contentType,
    };
  }

  for (const element of SCALABLE_DIMENSIONS) {
    const scalableDimensions = element;
    if (maxDimensions < scalableDimensions) {
      continue;
    }

    // We need these operations to be in serial

    const blob = await getCanvasBlobAsJPEG(
      data.image,
      scalableDimensions,
      quality
    );
    if (blob.size <= size) {
      return {
        blob,
        contentType: IMAGE_JPEG,
      };
    }
  }

  const blob = await getCanvasBlobAsJPEG(data.image, MIN_DIMENSIONS, quality);
  return {
    blob,
    contentType: IMAGE_JPEG,
  };
}
