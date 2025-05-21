create user "auth_user" with password '7XezX5Y0vzKf4CzyM0C857qa';
-- this allows auth_user user to "see" the `auth` schema
grant usage on schema "auth" to "auth_user";
--
alter user "auth_user" set search_path = auth;
-- at this point, `auth_user` user can see the `auth` schema 
grant select,
    insert,
    update,
    delete on table "auth"."users" to "auth_user";