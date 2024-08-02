import { Client } from '../models/client.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create a new client
export const createClient = async (req, res) => {
  try {
    const { clientId, name, description, mainUser } = req.body;

    if (!clientId || !name || !mainUser) {
      throw new ApiError(400, 'Client ID, name, and main user are required');
    }

    // Check if clientId is already used
    const existingClient = await Client.findOne({ clientId });
    if (existingClient) {
      throw new ApiError(409, 'Client with this ID already exists');
    }

    const client = await Client.create({ clientId, name, description, mainUser });

    res.status(201).json(new ApiResponse(200, client, 'Client created successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, {}, error.message));
  }
};

// Update client details
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const client = await Client.findByIdAndUpdate(id, updates, { new: true });
    if (!client) {
      throw new ApiError(404, 'Client not found');
    }

    res.status(200).json(new ApiResponse(200, client, 'Client updated successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, {}, error.message));
  }
};

// List all clients with optional filters
export const listClients = async (req, res) => {
  try {
    const { name, clientId } = req.query;

    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (clientId) query.clientId = clientId;

    const clients = await Client.find(query);
    res.status(200).json(new ApiResponse(200, clients, 'Clients retrieved successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, {}, error.message));
  }
};

// Get client details by ID
export const getClientDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id).populate('mainUser');
    if (!client) {
      throw new ApiError(404, 'Client not found');
    }

    res.status(200).json(new ApiResponse(200, client, 'Client details retrieved successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, {}, error.message));
  }
};

// Delete a client by ID
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      throw new ApiError(404, 'Client not found');
    }

    res.status(200).json(new ApiResponse(200, {}, 'Client deleted successfully'));
  } catch (error) {
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, {}, error.message));
  }
};
