import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class Todo extends Model {
  static table = 'todos';

  @field('uuid') uuid;
  @field('title') title;
  @field('place') place;
  @field('is_complete') is_complete;
  @field('is_active') is_active;
  @field('lat') lat;
  @field('lng') lng;
  @field('placeId') placeId;
  @field('userId') userId;
  @date('created_at') created_at;
  @date('updated_at') updated_at;

  getTodo = () => {
    return {
      uuid: this.uuid,
      title: this.title,
      place: this.place,
      is_complete: this.is_complete,
      is_active: this.is_active,
      lat: this.lat,
      lng: this.lng,
      placeId: this.placeId,
      userId: this.userId,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  };

  updateTodo = async updatedTodo => {
    await this.update(todo => {
      todo.title = updatedTodo.title;
      todo.place = updatedTodo.place;
      todo.is_complete = updatedTodo.is_complete;
      todo.is_active = updatedTodo.is_active;
      todo.lat = updatedTodo.lat;
      todo.lng = updatedTodo.lng;
      todo.placeId = updatedTodo.placeId;
      todo.userId = updatedTodo.userId;
      todo.created_at = updatedTodo.created_at;
      todo.updated_at = updatedTodo.updated_at;
    });
  };
}
