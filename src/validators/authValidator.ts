export const registerRules = {
    email: 'required|email|minLength:5|maxLength:320',
    password: 'required|string|minLength:8|maxLength:20|same:confirm_password',
    confirm_password: 'required|string'
};

export const loginRules = {
    email: 'required|email|minLength:5|maxLength:320',
    password: 'required|string|minLength:8|maxLength:20'
};
