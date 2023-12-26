'use strict';

import {uniqueNamesGenerator, adjectives, animals} from 'unique-names-generator';

export const generateUsername = () => uniqueNamesGenerator({  // big-donkey
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
});
