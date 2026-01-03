class ApiResponse {
    constructor(statusCode, message, data) {
        if (statusCode !== null) {
            this.statusCode = statusCode;
        }

        if (message !== null) {
            this.message = message;
        }

        if (data !== null) {
            this.data = data;
        }


    }

   
}

module.exports =  ApiResponse ;