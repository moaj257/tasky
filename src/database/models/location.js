import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class Location extends Model {
  static table = 'locations';

  @field('uuid') uuid;
  @field('title') title;
  @field('desc') desc;
  @field('todoId') todoId;
  @field('userId') userId;
  @field('is_active') is_active;
  @date('created_at') created_at;
  @date('updated_at') updated_at;

  getLocation = () => {
    return {
      uuid: this.uuid,
      title: this.title,
      desc: this.desc,
      todoId: this.todoId,
      userId: this.userId,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  };

  updateLocation = async updatedLocation => {
    await this.update(location => {
      location.uuid = updatedLocation.uuid;
      location.title = updatedLocation.title;
      location.desc = updatedLocation.desc;
      location.todoId = updatedLocation.todoId;
      location.userId = updatedLocation.userId;
      location.is_active = updatedLocation.is_active;
      location.created_at = updatedLocation.created_at;
      location.updated_at = updatedLocation.updated_at;
    });
  };
}
