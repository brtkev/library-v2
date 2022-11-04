using my.library as lib from '../db/schema';


service Library {
  entity Books as projection on lib.Books;
  // entity Authors as projection on lib.Authors;
  // entity B2A as projection on lib.Books2Authors;
  // entity Categories as projection on lib.Categories;
  // entity B2C as projection on lib.Books2Categories;
}

