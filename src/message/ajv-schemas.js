import Ajv from 'ajv';

const ajv = new Ajv();

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



const cmd_chls_schema = {
    type: 'object',
    properties: {
        auth_token: { type: 'string' },
        data: {
            type: 'object',
            properties: {
                cmd: { type: 'string', const: 'chls' }
            },
            required: ['cmd'],
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
        chls:  ajv.compile(cmd_chls_schema),
        nop:   _ => null
    }
};

// return a valid json or null
function parseCommand(type, json_obj) {
    const cmd = validate.cmd[type ?? 'nop']( json_obj ) ? json_obj : null;
    return Object.assign({valid: !!cmd}, cmd ?? json_obj);
}

function parseCmd(data) {
    data = JSON.parse(data);
    return parseCommand(data?.data?.cmd, data);
}

export {validate, parseCmd};
