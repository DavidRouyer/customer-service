 
import {useEffect, useLayoutEffect} from 'react';

import {isServer} from './is-server';

export const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;