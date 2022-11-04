using my.library as lib from '../db/schema';


service Library {
  entity Books @readonly as projection on lib.Books;
  entity Authors @readonly as projection on lib.Authors;
  entity B2A @readonly as projection on lib.Books2Authors;
  entity Categories @readonly as projection on lib.Categories;
  entity B2C @readonly as projection on lib.Books2Categories;
}

