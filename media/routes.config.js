// const JobsController = require('./controllers/jobs.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const MediaMiddleware = require('../media/middlewares/verify.media.middleware');
const config = require('../common/config/env.config');

const ADMIN = process.env.ADMIN// config.permissionLevels.ADMIN;
const PAID = process.env.PAID// config.permissionLevels.PAID_USER;
const FREE = process.env.NORMAL_USER// config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
  /*app.post('/users/:userId/media', [
    // console.log('hi')
    // uploadImage.single("image")
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    MediaMiddleware.from_url
  ]);*/
  app.post('/users/:userId/media', MediaMiddleware.upload.single('file'), [
    // MediaMiddleware.put_from_file
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    MediaMiddleware.local_media
  ]);
  app.post('/folder', [
    MediaMiddleware.createFolder
  ]);
    /*app.post('/jobs', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        JobsController.insert
    ]);
    app.post('/users/:userId/jobs', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        JobsController.insert
    ]);
    app.get('/jobs', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        JobsController.list
    ]);
    app.get('/jobs/:jobId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        JobsController.getById
    ]);
    app.get('/users/:userId/jobs', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        JobsController.getByUser
    ]);
    app.get('/users/:userId/jobs/:jobId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        JobsController.getById
    ]);
    app.patch('/jobs/:jobId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        // PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        JobsController.patchById
    ]);
    app.patch('/users/:userId/jobs/:jobId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        JobsController.patchById
    ]);
    app.delete('/jobs/:jobId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        JobsController.removeById
    ]);
    app.delete('/users/:userId/jobs/:jobId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        JobsController.removeById
    ]);*/
};
