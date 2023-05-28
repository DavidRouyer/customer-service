import { FC } from 'react';
import { Trans } from 'react-i18next';

import { TextEditor } from '@/components/TextEditor/TextEditor';
import { PaperclipIcon, SmilePlusIcon } from 'lucide-react';

export const MessageForm: FC = () => {
  return (
    <form action="#" className="relative">
      <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextEditor />
        {/* Spacer element to match the height of the toolbar */}
        <div className="py-2" aria-hidden="true">
          {/* Matches height of button in toolbar (1px border + 36px content height) */}
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
        <div className="flex items-center space-x-5">
          <div className="flex items-center">
            <button
              type="button"
              className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
            >
              <PaperclipIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">
                <Trans i18nKey="text_editor.attach_files" />
              </span>
            </button>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
            >
              <SmilePlusIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">
                <Trans i18nKey="text_editor.add_emoticons" />
              </span>
            </button>
          </div>
        </div>
        <div className="shrink-0">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Trans i18nKey="text_editor.send" />
          </button>
        </div>
      </div>
    </form>
  );
};

MessageForm.displayName = 'MessageForm';
