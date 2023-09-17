import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

import { AttachmentError, preProcessAttachment } from '~/utils/attachment';

export type AttachmentContextType = {
  draftAttachments: { file: File; uploadedFile?: PutBlobResult }[];
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
    { file: File; uploadedFile?: PutBlobResult }[]
  >([]);

  const processAttachments = useCallback(
    async (ticketId: number, files: readonly File[]) => {
      console.log('processAttachments', ticketId, files);
      if (!files.length) {
        return;
      }

      const filesToProcess: File[] = [];

      for (const file of files) {
        const preProcessResult = preProcessAttachment(file, draftAttachments);
        if (preProcessResult) {
          return preProcessResult;
        } else {
          filesToProcess.push(file);
          setDraftAttachments([...draftAttachments, { file }]);
        }
      }

      console.log('filesToProcess', filesToProcess);

      await Promise.all(
        filesToProcess.map(async (file) => {
          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/message/upload',
          });

          setDraftAttachments([
            ...draftAttachments.filter((f) => f.file !== file),
            { file, uploadedFile: newBlob },
          ]);
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
