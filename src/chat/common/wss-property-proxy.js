'use strict';

const Sym = {
    data: Symbol('data')
};

export const data = (client) => {
    return client[Sym.data];
};

export const mix = (client, instance) => {
    client[Sym.data] = instance;
    Object.defineProperty(client, Sym.data, {writable: false});
};
