import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { upload } from '@vercel/blob/client';

import {
  AttachmentDraftType,
  AttachmentError,
  getPendingAttachment,
  InMemoryAttachmentDraftType,
  preProcessAttachment,
  processAttachment,
} from '~/utils/attachment';

export type AttachmentContextType = {
  attachments: InMemoryAttachmentDraftType[];
  draftAttachments: AttachmentDraftType[];
  processAttachments: (
    ticketId: number,
    files: readonly File[]
  ) => Promise<
    | {
        error: AttachmentError;
      }
    | undefined
  >;
};

const AttachmentContext = createContext<AttachmentContextType | undefined>(
  undefined
);

export const useAttachment = () => {
  const context = useContext(AttachmentContext);

  if (!context) {
    throw new Error('useAttachment must be used within a AttachmentProvider');
  }

  return context;
};

export type AttachmentProviderProps = {
  children: React.ReactNode;
};

export const AttachmentProvider: React.FC<AttachmentProviderProps> = ({
  children,
}) => {
  const [draftAttachments, setDraftAttachments] = useState<
    AttachmentDraftType[]
  >([]);
  const [attachments, setAttachments] = useState<InMemoryAttachmentDraftType[]>(
    []
  );

  const processAttachments = useCallback(
    async (ticketId: number, files: readonly File[]) => {
      if (!files.length) {
        return;
      }

      const filesToProcess: File[] = [];

      for (const file of files) {
        const preProcessResult = preProcessAttachment(file, draftAttachments);
        if (preProcessResult) {
          return preProcessResult;
        } else {
          const pendingAttachment = getPendingAttachment(file);
          if (pendingAttachment) {
            filesToProcess.push(file);
            setDraftAttachments((oldDraftAttachments) => [
              ...oldDraftAttachments,
              pendingAttachment,
            ]);
          }
        }
      }

      console.log('filesToProcess', filesToProcess);

      await Promise.all(
        filesToProcess.map(async (file) => {
          const attachment = await processAttachment(file, {
            generateScreenshot: true,
          });

          setAttachments((oldAttachments) => [...oldAttachments, attachment]);

          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/message/upload',
          });

          const attachmentWithUrl = {
            ...attachment,
            url: newBlob.url,
          };
          console.log('attachmentWithUrl', attachmentWithUrl);
          setAttachments((oldAttachments) => [
            ...oldAttachments.filter(
              (attach) => attach.fileName !== attachment.fileName
            ),
            attachmentWithUrl,
          ]);
        })
      );
    },
    [draftAttachments]
  );

  const contextValue = useMemo<AttachmentContextType>(() => {
    return {
      attachments,
      draftAttachments,
      processAttachments,
    };
  }, [attachments, draftAttachments, processAttachments]);

  return (
    <AttachmentContext.Provider value={contextValue}>
      {children}
    </AttachmentContext.Provider>
  );
};
