import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class EventType extends Model {
  static table = 'event_types';

  @field('uuid') uuid;
  @field('name') name;
  @field('is_active') is_active;
  @date('created_at') created_at;
  @date('updated_at') updated_at;

  getEventType = () => {
    return {
      uuid: this.uuid,
      name: this.name,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  };

  updateEventType = async updatedEvent => {
    await this.update(place => {
      place.uuid = updatedEvent.uuid;
      place.name = updatedEvent.name;
      place.is_active = updatedEvent.is_active;
      place.created_at = updatedEvent.created_at;
      place.updated_at = updatedEvent.updated_at;
    });
  };
}
