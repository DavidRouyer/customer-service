import { FC, Fragment } from 'react';

import { Image } from '~/components/messages/image';
import { useAttachment } from '~/utils/use-attachment';

const IMAGE_WIDTH = 120;
const IMAGE_HEIGHT = 120;

export const AttachmentList: FC = () => {
  const { attachments, draftAttachments } = useAttachment();

  if (!attachments.length) {
    return null;
  }

  console.log('draftAttachments', draftAttachments);
  console.log('attachments', attachments);

  return (
    attachments && (
      <div className="flex">
        {attachments.map((attachment, index) => {
          const key = attachment.path || attachment.fileName || index;
          const imgElement = (
            <Image
              key={key}
              alt={''}
              className="module-staged-attachment"
              attachment={attachment}
              height={IMAGE_HEIGHT}
              width={IMAGE_WIDTH}
              url={attachment.url}
              closeButton
            />
          );
          return <Fragment key={key}>{imgElement}</Fragment>;
        })}
      </div>
    )
  );
};
