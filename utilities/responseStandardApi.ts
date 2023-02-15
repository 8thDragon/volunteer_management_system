export class ResponseStandard {
    success: boolean;
    result: object;
    error_code: string;
    error_message: string;

    constructor() {
      this.success = false;
      this.result = null;
      this.error_code = "";
      this.error_message = "";
    }
  
  }