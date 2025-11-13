"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTask = exports.validateRegister = void 0;
const validateRegister = (data) => {
    const errors = [];
    // name
    if (!data.name || data.name.length < 2)
        errors.push('name');
    // email: basic RFC-like check
    const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!data.email || !EMAIL_REGEX.test(data.email))
        errors.push('email');
    // password: require minimum 8 chars, at least one uppercase, one lowercase, one digit and one special character
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!data.password || !PASSWORD_REGEX.test(data.password))
        errors.push('password');
    return errors;
};
exports.validateRegister = validateRegister;
const validateTask = (data, partial = false) => {
    const errors = [];
    // title required only for full validations (e.g., create). For partial updates, title may be omitted.
    if (!partial) {
        if (!data.title || data.title.length < 1)
            errors.push('title');
    }
    else {
        if (data.title !== undefined && data.title.length < 1)
            errors.push('title');
    }
    if (data.priority && !['low', 'medium', 'high'].includes(data.priority))
        errors.push('priority');
    // Accept several common status representations used by frontend/backends
    const allowedStatuses = ['pending', 'in_progress', 'completed', 'in progress', 'in-progress', 'doing', 'done', 'cancelled', 'canceled'];
    if (data.status && !allowedStatuses.includes(data.status))
        errors.push('status');
    return errors;
};
exports.validateTask = validateTask;
