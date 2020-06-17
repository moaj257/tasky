import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class Place extends Model {
  static table = 'places';

  @field('uuid') uuid;
  @field('name') name;
  @field('lat') lat;
  @field('lng') lng;
  @field('is_active') is_active;
  @date('created_at') created_at;
  @date('updated_at') updated_at;

  getPlace = () => {
    return {
      uuid: this.uuid,
      name: this.name,
      lat: this.lat,
      lng: this.lng,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  };

  updateLocation = async updatedPlace => {
    await this.update(place => {
      place.uuid = updatedPlace.uuid;
      place.name = updatedPlace.name;
      place.lat = updatedPlace.lat;
      place.lng = updatedPlace.lng;
      place.is_active = updatedPlace.is_active;
      place.created_at = updatedPlace.created_at;
      place.updated_at = updatedPlace.updated_at;
    });
  };
}
