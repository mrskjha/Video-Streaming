class ApiResponce {
  constructor(success, message="Success", data=null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

export{ApiResponce}