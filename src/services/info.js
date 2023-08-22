export const generateErrorInfo = (user)=>{
    return `One or more properties were completed or invalid
    List of required properties:
    *first_name: needs to be a String, received ${user.firstName}
    *last_name: needs to be a String, received ${user.lastName}
    *email: needs to be a String, received ${user.email}`
}