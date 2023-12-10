import Ajv from 'ajv';

const ajv = new Ajv(); // Opzioni possono essere passate come parametro

const login_schema = {
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                cmd:    { type: 'string', const: 'login' },
                user:   { type: 'string' },
                passwd: { type: 'string' }
            },
            required: ['cmd', 'user', 'passwd'],
            additionalProperties: false
        }
    },
    required: ['data'],
    additionalProperties: false
};


// TODO:

//const validate = ajv.compile(schema);
