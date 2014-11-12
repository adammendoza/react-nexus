module.exports = function(R) {
  return (params) => {
    class Cordova extends R.App.Plugin {
      constructor({ flux, window, req, headers }) {
        super(...arguments);
        if(window) {
          // Client-only init
        }
        else {
          // Server-only init
        }
      }

      getDisplayName() {
        return 'Cordova';
      }
    }

    return Cordova;
  };
};
