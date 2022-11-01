using my.library as lib from '../db/schema';

service Library {
  entity Books @readonly as projection on lib.Books;
  entity Authors @readonly as projection on lib.Authors;
  entity Categories @readonly as projection on lib.Categories;
}
