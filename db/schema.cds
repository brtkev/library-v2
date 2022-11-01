namespace my.library;
using { managed, cuid } from '@sap/cds/common';

  entity Books : managed, cuid {
    title : String(100) not null; 
    subtitle : String(100);
    descr : String;
    publishDate : Date;
    imageLink : String(100);
    editorial : String(100);
    source : String(100);
    authors : Association to many Books2Authors on authors.book = $self;
    categories : Association to many Books2Categories on categories.book = $self;
  }

  entity Authors : managed, cuid {
    name : String(100) not null;
    books : Association to many Books2Authors on books.author = $self;
  }

  entity Books2Authors {
    key book : Association to Books;
    key author : Association to Authors;
  }

  entity Categories : cuid, managed {
    name : String(100) not null;
    books : Association to many Books2Categories on books.category = $self
  }

  entity Books2Categories {
    key book : Association to Books;
    key category : Association to Categories;
  }

