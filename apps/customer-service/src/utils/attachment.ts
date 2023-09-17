import { type PutBlobResult } from '@vercel/blob';

const MAX_FILE_SIZE = 5000;
const MAX_ATTACHMENTS = 12;

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

export const preProcessAttachment = (
  file: File,
  draftAttachments: { file: File; uploadedFile?: PutBlobResult }[]
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
