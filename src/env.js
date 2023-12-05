import 'dotenv/config';

// TODO: memoization
// console.log( typeof(process.env.PIPPO) ) se pippo è definita PIPPO= allora vale stringa vuota
export default function env(key, default_value) {

    if (default_value === undefined && !(key in process.env))
        throw `invalid env key="${key}"`;

    return process.env[key] ?? default_value;
}
