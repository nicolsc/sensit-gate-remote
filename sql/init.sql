create table if not exists callback_logs(
  id serial primary key,
  date timestamp not null,
  method varchar(8),
  path varchar(50),
  data json not null
);

create table if not exists sensit_calls(
  id serial primary key,
  deviceid varchar(10) not null,
  date timestamp not null
);

