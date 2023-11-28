import Contact from '../models/contact.js';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

import {
	contactAddSchema,
	contactUpdateById,
	contactFavoriteSchema,
} from '../schemas/contact-schemas.js';

const getAllContacts = async (req, res) => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 10 } = req.query;
	const skip = (page - 1) * limit;

	const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
		skip,
		limit,
	}).populate('owner');
	res.json(result);
};

const add = async (req, res) => {
	const { _id: owner } = req.user;
	const { error } = contactAddSchema.validate(req.body);
	const result = await Contact.create({ ...req.body, owner });
	if (error) {
		throw new HttpError(406, error.message);
	}
	res.status(201).json(result);
};

const getById = async (req, res) => {
	const { contactId } = req.params;
	const { _id: owner } = req.user;
	const { error } = contactUpdateById.validate(req.body);
	const result = await Contact.findById({ _id: contactId, owner });
	if (error) {
		throw new HttpError(404, `Contact with id=${contactId} not found`);
	}
	res.json(result);
};

const updateById = async (req, res) => {
	const { contactId } = req.params;
	const { _id: owner } = req.user;
	const { error } = contactUpdateById.validate(req.body);
	const result = await Contact.findOneAndUpdate(
		{ _id: contactId, owner },
		req.body
	);
	if (error) {
		throw new HttpError(404, `Contact with id=${contactId} not found`);
	}
	res.json(result);
};

const updateByIdFavorite = async (req, res) => {
	const { contactId } = req.params;
	const { _id: owner } = req.user;
	const { error } = contactFavoriteSchema.validate(req.body);
	const result = await Contact.findOneAndUpdate(
		{ _id: contactId, owner },
		req.body
	);
	if (error) {
		throw new HttpError(404, `Contact with id=${contactId} not found`);
	}
	res.json(result);
};

const deleteById = async (req, res) => {
	const { contactId } = req.params;
	const { _id: owner } = req.user;
	const result = await Contact.findOneAndDelete({ _id: contactId, owner });
	if (!result) {
		throw new HttpError(404, `Contact with id=${contactId} not found`);
	}
	res.json({
		message: 'Delete success',
	});
};

export default {
	getAllContacts: ctrlWrapper(getAllContacts),
	getById: ctrlWrapper(getById),
	add: ctrlWrapper(add),
	updateById: ctrlWrapper(updateById),
	updateByIdFavorite: ctrlWrapper(updateByIdFavorite),
	deleteById: ctrlWrapper(deleteById),
};
