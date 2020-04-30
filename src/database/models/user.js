import {Model} from '@nozbe/watermelondb';
import {field, relation, date} from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @field('uuid') uuid;
  @field('_gid') _gid;
  @field('name') name;
  @field('photo') photo;
  @field('is_active') is_active;
  @date('created_at') created_at;
  @date('updated_at') updated_at;

  getUser = () => {
    return {
      uuid: this.uuid,
      _gid: this._gid,
      name: this.name,
      photo: this.photo,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  };

  updateUser = async updatedUser => {
    await this.update(user => {
      user._gid = updatedUser._gid;
      user.name = updatedUser.name;
      user.photo = updatedUser.photo;
      user.is_active = updatedUser.is_active;
      user.created_at = updatedUser.created_at;
      user.updated_at = updatedUser.updated_at;
    });
  };
}
