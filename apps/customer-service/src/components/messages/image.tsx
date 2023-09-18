// Copyright 2018 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import React from 'react';
import clsx from 'clsx';
import { Loader } from 'lucide-react';
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

export function Image({
  alt,
  attachment,
  className,
  height = 0,
  noBackground,
  overlayText,
  playIconOverlay,
  tabIndex,
  url,
  width = 0,
  cropWidth = 0,
  cropHeight = 0,
}: Props): JSX.Element {
  const { pending } = attachment || { pending: true };
  const imgNotDownloaded = false;

  const resolvedBlurHash =
    attachment.blurHash || 'L05OQnoffQofoffQfQfQfQfQfQfQ';

  return (
    <div
      className={clsx(
        'module-image relative inline-block align-middle',
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
        attachment.blurHash ? (
          <div className="module-image__download-pending">
            <Blurhash
              hash={attachment.blurHash}
              width={width}
              height={height}
              style={{ display: 'block' }}
            />
            <div className="module-image__download-pending--spinner-container">
              <div
                className="module-image__download-pending--spinner"
                title={'title'}
              >
                {/*<Spinner
                  moduleClassName="module-image-spinner"
                  svgSize="small"
        />*/}
                <Loader size={24} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="module-image__loading-placeholder"
            style={{
              height: `${height}px`,
              width: `${width}px`,
              lineHeight: `${height}px`,
              textAlign: 'center',
            }}
            title={'title'}
          >
            <Loader size={24} />
            {/*<Spinner svgSize="normal" />*/}
          </div>
        )
      ) : url ? (
        <img
          className="module-image__image h-[120px] w-[120px] object-cover"
          alt={alt}
          height={height}
          width={width}
          src={url}
        />
      ) : resolvedBlurHash ? (
        <Blurhash
          hash={resolvedBlurHash}
          width={width}
          height={height}
          style={{ display: 'block' }}
        />
      ) : null}
      {!pending && !imgNotDownloaded && playIconOverlay ? (
        <div className="module-image__play-overlay__circle">
          <div className="module-image__play-overlay__icon" />
        </div>
      ) : null}
      {overlayText ? (
        <div
          className="module-image__text-container"
          style={{ lineHeight: `${height}px` }}
        >
          {overlayText}
        </div>
      ) : null}
    </div>
  );
  /* eslint-enable no-nested-ternary */
}
