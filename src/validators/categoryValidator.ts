export const createCategoryRules = {
    name: 'required|string',
    parent_id: 'string' // optional, but if provided, must be string
};

export const updateCategoryRules = {
    name: 'string',
    status: 'string|in:active,inactive'
};
