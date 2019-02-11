const store = {
    getDataInformation() {
      return JSON.parse(localStorage.getItem("token"))
    },
    setDataInformation(token) {
      localStorage.setItem("token", JSON.stringify(token))
    }
  }
  
  module.exports = store