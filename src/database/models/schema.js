import {appSchema, tableSchema} from '@nozbe/watermelondb';
export const mySchema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        {name: 'uuid', type: 'string'},
        {name: '_gid', type: 'string', isIndexed: true},
        {name: 'name', type: 'string'},
        {name: 'photo', type: 'string'},
        {name: 'is_active', type: 'boolean'},
        {name: 'created_at', type: 'number', isIndexed: true},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'todos',
      columns: [
        {name: 'uuid', type: 'string'},
        {name: 'title', type: 'string'},
        {name: 'place', type: 'string'},
        {name: 'is_complete', type: 'boolean', isIndexed: true},
        {name: 'is_active', type: 'boolean', isIndexed: true},
        {name: 'is_birthday', type: 'boolean', isIndexed: true},
        {name: 'reminder_date_time_at', type: 'number'},
        {name: 'lat', type: 'string'},
        {name: 'lng', type: 'string'},
        {name: 'placeId', type: 'string'},
        {name: 'userId', type: 'string', isIndexed: true},
        {name: 'created_at', type: 'number', isIndexed: true},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'notifications',
      columns: [
        {name: 'uuid', type: 'string'},
        {name: 'title', type: 'string'},
        {name: 'desc', type: 'string'},
        {name: 'todoId', type: 'number', isIndexed: true},
        {name: 'userId', type: 'number', isIndexed: true},
        {name: 'is_active', type: 'boolean', isIndexed: true},
        {name: 'created_at', type: 'number', isIndexed: true},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'locations',
      columns: [
        {name: 'uuid', type: 'string'},
        {name: 'lat', type: 'string'},
        {name: 'lng', type: 'string'},
        {name: 'userId', type: 'number', isIndexed: true},
        {name: 'is_active', type: 'boolean', isIndexed: true},
        {name: 'created_at', type: 'number', isIndexed: true},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'places',
      columns: [
        {name: 'uuid', type: 'string'},
        {name: 'name', type: 'string', isIndexed: true},
        {name: 'lat', type: 'string'},
        {name: 'lng', type: 'string'},
        {name: 'is_active', type: 'boolean', isIndexed: true},
        {name: 'created_at', type: 'number', isIndexed: true},
        {name: 'updated_at', type: 'number'},
      ],
    }),
  ],
});
