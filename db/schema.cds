namespace my.library;
using { managed, cuid } from '@sap/cds/common';

  entity Books {
    key ID : Integer ;
    title : String(100) not null; 
    subtitle : String(100);
    descr : String;
    publishDate : String(100);
    imageLink : String;
    editorial : String(100);
    source : String(100);
    authors : String;
    categories: String;
    // authors : Association to many Books2Authors on authors.book = $self;
    // categories : Association to many Books2Categories on categories.book = $self;
  }

  entity Authors {
    key ID : Integer;
    name : String(100) not null;
    books : Association to many Books2Authors on books.author = $self;
  }

  entity Books2Authors {
    key book : Association to Books;
    key author : Association to Authors;
  }

  entity Categories {
    key ID : Integer ;
    name : String(100) not null;
    books : Association to many Books2Categories on books.category = $self
  }

  entity Books2Categories {
    key book : Association to Books;
    key category : Association to Categories;
  }

