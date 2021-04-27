import { Model, snakeCaseMappers } from 'objection';
import moment from 'moment';
import knex from '@/libs/knex';

Model.knex(knex);

class BaseModel extends Model {
  public created_at!: string;
  public updated_at!: string;

  static get modelPaths() {
    return [__dirname];
  }

  get $hasTimestamps() {
    return false;
  }

  $beforeInsert() {
    if (this.$hasTimestamps) {
      this.created_at = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    }
  }

  $beforeUpdate() {
    if (this.$hasTimestamps) {
      this.updated_at = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    }
  }
}

export default BaseModel;
