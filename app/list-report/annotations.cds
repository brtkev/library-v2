using Library as service from '../../srv/service';

annotate Library.Books with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : title,
            Label : 'Title',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : subtitle,
            Label : 'subtitle',
        },
        {
            $Type : 'UI.DataField',
            Value : descr,
            Label : 'description',
        },
        {
            $Type : 'UI.DataField',
            Value : authors.author.name,
            Label : 'authors',
        },
        {
            $Type : 'UI.DataField',
            Value : categories.category.name,
            Label : 'categories',
        },
        {
            $Type : 'UI.DataField',
            Value : publishDate,
            Label : 'Published',
        },
        {
            $Type : 'UI.DataField',
            Value : editorial,
            Label : 'Editorial',
        },
        {
            $Type : 'UI.DataField',
            Value : imageLink,
            Label : 'Image',
        },
        {
            $Type : 'UI.DataField',
            Value : source,
            Label : 'Source',
        },
    ]
);
