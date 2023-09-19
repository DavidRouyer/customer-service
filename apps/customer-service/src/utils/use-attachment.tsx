import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { upload } from '@vercel/blob/client';

import {
  AttachmentError,
  AttachmentType,
  getPendingAttachment,
  preProcessAttachment,
  processAttachment,
} from '~/utils/attachment';

export type AttachmentContextType = {
  draftAttachments: AttachmentType[];
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
  const [draftAttachments, setDraftAttachments] = useState<AttachmentType[]>(
    []
  );

  const processAttachments = useCallback(
    async (ticketId: number, files: readonly File[]) => {
      if (!files.length) {
        return;
      }

      const filesToProcess: { file: File; id: string }[] = [];

      for (const file of files) {
        const preProcessResult = preProcessAttachment(file, draftAttachments);
        if (preProcessResult) {
          return preProcessResult;
        } else {
          const pendingAttachment = getPendingAttachment(file);
          if (pendingAttachment) {
            filesToProcess.push({ file, id: pendingAttachment.id });
            setDraftAttachments((oldDraftAttachments) => [
              ...oldDraftAttachments,
              pendingAttachment,
            ]);
          }
        }
      }

      await Promise.all(
        filesToProcess.map(async (file) => {
          const attachment = await processAttachment(file.id, file.file);

          setDraftAttachments((oldAttachments) => {
            const updatedAttachments = [...oldAttachments];
            const index = updatedAttachments.findIndex(
              (a) => a.id === attachment.id
            );
            updatedAttachments[index] = attachment;
            return updatedAttachments;
          });

          const newBlob = await upload(file.file.name, file.file, {
            access: 'public',
            handleUploadUrl: '/api/message/upload',
          });

          setDraftAttachments((oldAttachments) => {
            const updatedAttachments = [...oldAttachments];
            const index = updatedAttachments.findIndex(
              (a) => a.id === attachment.id
            );
            const updatedAttachment = updatedAttachments[index];
            if (updatedAttachment)
              updatedAttachments[index] = {
                ...updatedAttachment,
                url: newBlob.url,
              };
            return updatedAttachments;
          });
        })
      );
    },
    [draftAttachments]
  );

  const contextValue = useMemo<AttachmentContextType>(() => {
    return {
      draftAttachments,
      processAttachments,
    };
  }, [draftAttachments, processAttachments]);

  return (
    <AttachmentContext.Provider value={contextValue}>
      {children}
    </AttachmentContext.Provider>
  );
};
