import knexfile from '../../knexfile';
import knex from 'knex';

// @ts-ignore
const knexConf: string = knexfile()[process.env.NODE_ENV || 'development'] as any;

export default knex(knexConf);
