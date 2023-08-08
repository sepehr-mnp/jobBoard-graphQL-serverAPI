const db = require('./db');

const Query = {
    company: (root,{id}) => db.companies.get(id),
    job: (root,{id}) => db.jobs.get(args.id),
    jobs: () => db.jobs.list()
};

const Mutation = {
    createJob: (root,{input}) => {
        const id = db.jobs.create(input);
        return db.jobs.get(id);
    }
};

const Company = {
    jobs: (company) => db.jobs.list().filter((job) => job.companyId === company.id)
};

const Job = {
    company: (job) => db.companies.get(job.companyId)
};


///baraye gereftan in bayad {jobs {description}} ro masalan bezani ta moshakhas beshe che field haii ro mikhay, {jobs} khaill error mide age moshakhas nakoni

// oon query injory {greeting}   va   query{greeting}  farghi nadaran

/// age schema ro okey koni vali to resolver taarif nakoni, mitooni call koni as console khode graphql vali faghat null migiti(//* baresi kon age in schema ro taarif nakoni chi mishe? javab ehtemali error hast)
 
/// to gereftan element ha, jaye ona ro be har tartibi bezary, hamoonjoori mide

module.exports = { Query, Mutation, Company, Job };