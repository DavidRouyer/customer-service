import { FC, Fragment } from 'react';

import { AttachmentImage } from '~/components/messages/attachment-image';
import { useAttachment } from '~/utils/use-attachment';

const IMAGE_WIDTH = 120;
const IMAGE_HEIGHT = 120;

export const AttachmentList: FC = () => {
  const { draftAttachments } = useAttachment();

  if (!draftAttachments.length) {
    return null;
  }

  return (
    draftAttachments && (
      <div className="flex gap-2">
        {draftAttachments.map((attachment) => {
          const imgElement = (
            <AttachmentImage
              key={attachment.id}
              alt={''}
              className="module-staged-attachment"
              attachment={attachment}
              height={IMAGE_HEIGHT}
              width={IMAGE_WIDTH}
              closeButton
            />
          );
          return <Fragment key={attachment.id}>{imgElement}</Fragment>;
        })}
      </div>
    )
  );
};
