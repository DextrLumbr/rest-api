const JobModel = require('../models/jobs.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
    /*let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;*/
    JobModel.createJob(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    JobModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    JobModel.findById(req.params.jobId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.getByUser = (req, res) => {
  // console.log(req.params)
  // res.status(200).send(req.params);
    JobModel.findByUser(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    JobModel.patchJob(req.params.jobId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    JobModel.removeById(req.params.jobId)
        .then((result)=>{
            res.status(204).send({});
        });
};
