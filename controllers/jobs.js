const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { UnauthenticatedError } = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    return res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            jobs
        }
    })
}

const getJob = async (req, res) => {
    const job = await Job.findOne({
        _id: req.params.id,
        createdBy: req.user.userId
    })
    if (!job) {
        throw new NotFoundError(`No job with id ${req.params.id}`)
    }
    return res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            job
        }
    })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    return res.status(201).json({
        status: 'success',
        data: {
            job
        }
    })
}

const updateJob = async (req, res) => {
    const job = await Job.findOneAndUpdate({ _id: req.params.id, createdBy: req.user.userId }, { position: req.body.position, company: req.body.company }, {
        new: true,
        runValidators: true
    })
    if (!job) {
        throw new NotFoundError(`No job with id ${req.params.id}`)
    }

    return res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            job
        }
    })
}

const deleteJob = async (req, res) => {
    const job = await Job.findOneAndRemove({ _id: req.params.id, createdBy: req.user.userId })
    if (!job) {
        throw new NotFoundError(`No job with id ${req.params.id}`)
    }
    return res.status(StatusCodes.OK).json({
        status: 'success',
        data: null
    })

}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}
