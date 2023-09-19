import React, { useState } from 'react';
import clsx from 'clsx';
import { Blurhash } from 'react-blurhash';

import { AttachmentType } from '~/utils/attachment';

export type Props = {
  alt: string;
  attachment: AttachmentType;
  url?: string;

  className?: string;
  height?: number;
  width?: number;
  cropWidth?: number;
  cropHeight?: number;
  tabIndex?: number;

  overlayText?: string;

  noBorder?: boolean;
  noBackground?: boolean;
  bottomOverlay?: boolean;
  closeButton?: boolean;

  darkOverlay?: boolean;
  playIconOverlay?: boolean;
  blurHash?: string;
};

export function AttachmentImage({
  alt,
  attachment,
  className,
  height = 0,
  noBackground,
  width = 0,
  cropWidth = 0,
  cropHeight = 0,
}: Props): JSX.Element {
  const { pending } = attachment || { pending: true };
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const resolvedBlurHash =
    attachment.blurHash ?? 'L05OQnoffQofoffQfQfQfQfQfQfQ';

  return (
    <div
      className={clsx(
        'module-image relative inline-block overflow-hidden rounded-sm border border-foreground align-middle',
        className,
        !noBackground ? 'module-image--with-background' : null,
        cropWidth || cropHeight ? 'module-image--cropped' : null
      )}
      style={{
        width: width - cropWidth,
        height: height - cropHeight,
      }}
    >
      {pending ? (
        <div className="module-image__download-pending relative">
          <Blurhash
            hash={resolvedBlurHash}
            width={width}
            height={height}
            style={{ display: 'block' }}
          />
          <div className="module-image__download-pending--spinner-container absolute inset-0 flex items-center justify-center">
            <div
              className="module-image__download-pending--spinner"
              title={attachment.fileName}
            ></div>
          </div>
        </div>
      ) : (
        <>
          {attachment.preview && !isImageLoaded ? (
            <img
              className="module-image__image h-[120px] w-[120px] object-cover"
              alt={alt}
              height={height}
              width={width}
              src={attachment.preview}
            />
          ) : null}
          {attachment.url ? (
            <img
              className={`module-image__image h-[120px] w-[120px] object-cover ${
                !isImageLoaded ? 'hidden' : ''
              }`}
              alt={alt}
              height={height}
              width={width}
              src={attachment.url}
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : null}
        </>
      )}
    </div>
  );
  /* eslint-enable no-nested-ternary */
}
