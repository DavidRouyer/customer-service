import { handleImageAttachment, isImageTypeSupported } from '~/utils/image';
import { MIMEType, stringToMIMEType } from '~/utils/MIME';

const MAX_FILE_SIZE = 5000;
const MAX_ATTACHMENTS = 12;

export type AttachmentType = {
  id: string;
  error?: boolean;
  blurHash?: string;
  contentType: MIMEType;
  digest?: string;
  fileName?: string;
  url?: string;
  size: number;
  fileSize?: string;
  pending?: boolean;
  width?: number;
  height?: number;
  data?: Uint8Array;
};

export type BaseAttachmentDraftType = {
  blurHash?: string;
  contentType: MIMEType;
  screenshotContentType?: string;
  size: number;
};

export type InMemoryAttachmentDraftType =
  | ({
      data: Uint8Array;
      pending: false;
      fileName?: string;
      preview?: string;
      id: string;
    } & BaseAttachmentDraftType)
  | {
      contentType: MIMEType;
      fileName?: string;
      id: string;
      pending: true;
      size: number;
    };

// What's stored in conversation.draftAttachments
export type AttachmentDraftType =
  | ({
      url?: string;
      pending: false;
      fileName?: string;
      id: string;
      width?: number;
      height?: number;
    } & BaseAttachmentDraftType)
  | {
      contentType: MIMEType;
      fileName?: string;
      id: string;
      pending: true;
      size: number;
    };

export enum AttachmentError {
  FILE_TOO_LARGE,
  FILE_TYPE_NOT_ALLOWED,
  TOO_MANY_FILES,
}

// https://github.com/signalapp/Signal-Desktop/blob/main/ts/util/isFileDangerous.ts
const DANGEROUS_FILE_TYPES =
  /\.(ADE|ADP|APK|BAT|CAB|CHM|CMD|COM|CPL|DIAGCAB|DLL|DMG|EXE|HTA|INF|INS|ISP|JAR|JS|JSE|LIB|LNK|MDE|MHT|MSC|MSI|MSP|MST|NSH|PIF|PS1|PSC1|PSM1|PSRC|REG|SCR|SCT|SETTINGCONTENT-MS|SHB|SYS|VB|VBE|VBS|VXD|WSC|WSF|WSH)\.?$/i;

export function isFileDangerous(fileName: string): boolean {
  return DANGEROUS_FILE_TYPES.test(fileName);
}

export function fileToBytes(file: Blob): Promise<Uint8Array> {
  return new Promise((resolve, rejectPromise) => {
    const FR = new FileReader();
    FR.onload = () => {
      if (!FR.result || typeof FR.result === 'string') {
        rejectPromise(new Error('bytesFromFile: No result!'));
        return;
      }
      resolve(new Uint8Array(FR.result));
    };
    FR.onerror = rejectPromise;
    FR.onabort = rejectPromise;
    FR.readAsArrayBuffer(file);
  });
}

export const processAttachment = async (
  id: string,
  file: File
): Promise<InMemoryAttachmentDraftType> => {
  const fileType = stringToMIMEType(file.type);

  let attachment: InMemoryAttachmentDraftType;
  try {
    if (isImageTypeSupported(fileType)) {
      attachment = await handleImageAttachment(id, file);
    } else {
      const data = await fileToBytes(file);
      attachment = {
        contentType: fileType,
        data,
        fileName: file.name,
        id: id,
        pending: false,
        size: data.byteLength,
      };
    }
  } catch (e) {
    console.error(
      `Was unable to generate thumbnail for fileType ${fileType}`,
      e
    );
    const data = await fileToBytes(file);
    attachment = {
      contentType: fileType,
      data,
      fileName: file.name,
      id: id,
      pending: false,
      size: data.byteLength,
    };
  }

  return attachment;

  /*try {
    if (isAttachmentSizeOkay(attachment)) {
      return attachment;
    }
  } catch (error) {
    log.error(
      'Error ensuring that image is properly sized:',
      Errors.toLogFormat(error)
    );

    throw error;
  }*/
};

export const preProcessAttachment = (
  file: File,
  draftAttachments: AttachmentDraftType[]
) => {
  if (file.size / 1024 > MAX_FILE_SIZE)
    return {
      error: AttachmentError.FILE_TOO_LARGE,
    };

  if (isFileDangerous(file.name))
    return {
      error: AttachmentError.FILE_TYPE_NOT_ALLOWED,
    };

  if (draftAttachments.length >= MAX_ATTACHMENTS)
    return {
      error: AttachmentError.TOO_MANY_FILES,
    };

  return undefined;
};

export const getPendingAttachment = (
  file: File
): AttachmentDraftType | undefined => {
  if (!file) {
    return;
  }

  const fileType = stringToMIMEType(file.type);

  return {
    id: self.crypto.randomUUID(),
    contentType: fileType,
    fileName: file.name,
    size: file.size,
    pending: true,
  };
};
