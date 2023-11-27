import express from 'express';

import contactsController from '../../controllers/contactsController.js';

import authenticate from '../../middlewares/authenticate.js';

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter
	.route('/')
	.get(contactsController.getAllContacts)
	.post(contactsController.add);

contactsRouter
	.route('/:contactId')
	.get(contactsController.getById)
	.put(contactsController.updateById)
	.delete(contactsController.deleteById);

contactsRouter.patch(
	'/:contactId/favorite',
	contactsController.updateByIdFavorite
);

export default contactsRouter;
