namespace my.library;
using { managed, cuid } from '@sap/cds/common';

  entity Books : managed, cuid {
    title       : String(100);
    subtitle : String(100);
    descr       : String;
    publishDate : Date;
    imageLink : String(100);
    editorial : String(100);
    source : String(100);
    author : Association to Authors;
    categories : Association to many Categories;
  }

  entity Authors : managed, cuid {
    name : String(100);
    books : Association to many Books on books.author = $self;
  }

  entity Categories : cuid, managed {
    name : String(100);
    books : Association to many Books on books.categories = $self;
  }

