const mongoose = require('../../common/services/mongoose.service').mongoose;
const ObjectId = require('mongodb').ObjectId;
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    brandId: ObjectId,
    userId: ObjectId,
    // comps: [Schema.Types.Mixed]
},{strict: false});

jobSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
jobSchema.set('toJSON', {
    virtuals: true
});

jobSchema.findById = function (cb) {
    return this.model('Jobs').find({id: this.id}, cb);
};

const Job = mongoose.model('Jobs', jobSchema);


exports.findByEmail = (email) => {
    return Job.find({email: email});
};
exports.findById = (id) => {
    return Job.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.findByUser = (id) => {
    return Job.find({userId:id})
        /*.then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });*/
};

exports.createJob = (jobData) => {
    const job = new Job(jobData);
    return job.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Job.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, jobs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(jobs);
                }
            })
    });
};

exports.myList = (id,perPage,page) => {
  console.log(id)
}

exports.patchJob = (id, jobData) => {
    return Job.findOneAndUpdate({
        _id: id
    }, jobData);
};

exports.removeById = (jobId) => {
    return new Promise((resolve, reject) => {
        Job.deleteMany({_id: jobId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
