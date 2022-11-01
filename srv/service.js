module.exports = (srv) => {

    const { Books, Authors } = cds.entities('my.library')

    // Add some discount for overstocked books
    srv.after('READ', 'Books', each => {
        
        each.source = 'library database';
    })
}
