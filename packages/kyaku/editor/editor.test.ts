import { expect } from 'vitest';

import { extractMentions } from '.';

describe('extractMentions', () => {
  it('should get correct initials with first name', async () => {
    const content =
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"test ","type":"text","version":1},{"detail":1,"format":0,"mode":"segmented","style":"","text":"Jeff Lacey","type":"mention","version":1,"mentionName":"Jeff Lacey","mentionEntityId":"7fd35401-9aef-4332-9c49-d410e73d43db"},{"detail":0,"format":0,"mode":"normal","style":"","text":" babla","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

    expect(await extractMentions(content)).toEqual([
      '7fd35401-9aef-4332-9c49-d410e73d43db',
    ]);
  });
});
