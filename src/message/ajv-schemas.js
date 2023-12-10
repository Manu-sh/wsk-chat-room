import Ajv from 'ajv';

const ajv = new Ajv(); // Opzioni possono essere passate come parametro

const cmd_login_schema = {
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

// TODO: channel opzionale?
const cmd_join_schema = {
    type: 'object',
    properties: {
        auth_token: { type: 'string' },
        data: {
            type: 'object',
            properties: {
                cmd:     { type: 'string', const: 'join' },
                channel: { type: 'string' },
            },
            required: ['cmd', 'channel'],
            additionalProperties: false
        }
    },
    required: ['auth_token', 'data'],
    additionalProperties: false
};


const cmd_quit_schema = {
    type: 'object',
    properties: {
        auth_token: { type: 'string' },
        data: {
            type: 'object',
            properties: {
                cmd: { type: 'string', const: 'quit' }
            },
            required: ['cmd'],
            additionalProperties: false
        }
    },
    required: ['auth_token', 'data'],
    additionalProperties: false
};


const cmd_msg_schema = {
    type: 'object',
    properties: {
        auth_token: { type: 'string' },
        data: {
            type: 'object',
            properties: {
                cmd: { type: 'string', const: 'msg' },
                text: { type: 'string' },
            },
            required: ['cmd', 'text'],
            additionalProperties: false
        }
    },
    required: ['auth_token', 'data'],
    additionalProperties: false
};



const validate = {
    cmd: {
        login: ajv.compile(cmd_login_schema),
        join:  ajv.compile(cmd_join_schema),
        quit:  ajv.compile(cmd_quit_schema),
        msg:   ajv.compile(cmd_msg_schema),
    }
};

export {validate};
