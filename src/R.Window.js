module.exports = function(R) {
  const _ = require('lodash');
  const assert = require('assert');
  const should = R.should;

  const defaultParams = {
      width: 1280,
      height: 720,
      scrollTop: 0,
      scrollLeft: 0,
  };

  return (storeName, dispatcherName, eventEmitterName, params) => {
    class Window extends R.App.Plugin {
      constructor({ flux, window, req }){
        super();
        this.storeName = storeName;
        this.dispatcherName = dispatcherName;
        this.eventEmitterName = eventEmitterName;
        this.params = params || {};
        _.defaults(this.params, defaultParams);

        if(window) {
          // Client-only init
          flux.getDispatcher(this.dispatcherName).addActionListener('/Window/scrollTo', (params) => {
            return _.copromise(function* () {
              _.dev(() =>
                params.should.be.an.Object &&
                params.top.should.be.ok &&
                params.top.should.be.a.Number &&
                params.left.should.be.ok && 
                params.left.should.be.a.Number
                );
              window.scrollTo(params.top, params.left);
              yield _.defer;
            }, this);
          });
          window.addEventListener('scroll', () => {
            flux.getStore(this.storeName).set('/Window/scrollTop', window.scrollTop);
            flux.getStore(this.storeName).set('/Window/scrollLeft', window.scrollLeft);
            flux.getEventEmitter(this.eventEmitterName).emit('/Window/scroll', {
              scrollTop: window.scrollTop,
              scrollLeft: window.scrollLeft,
            });
          });
          window.addEventListener('resize', () => {
            flux.getStore(this.storeName).set('/Window/height', window.innerHeight);
            flux.getStore(this.storeName).set('/Window/width', window.innerWidth);
            flux.getEventEmitter(this.eventEmitterName).emit('/Window/resize', {
              height: window.innerHeight,
              width: window.innerWidth,
            });
          });
          flux.getStore(this.storeName).set('/Window/height', window.innerHeight);
          flux.getStore(this.storeName).set('/Window/width', window.innerWidth);
          flux.getStore(this.storeName).set('/Window/scrollTop', window.scrollTop);
          flux.getStore(this.storeName).set('/Window/scrollLeft', window.scrollLeft);
        }
        else {
          // Server-only init
          flux.getStore(this.storeName).set('/Window/height', this.params.height);
          flux.getStore(this.storeName).set('/Window/width', this.params.width);
          flux.getStore(this.storeName).set('/Window/scrollTop', this.params.scrollTop);
          flux.getStore(this.storeName).set('/Window/scrollLeft', this.params.scrollLeft);
        }
      }

      getDisplayName(){
          return 'Window';
      }
    }

    _.extend(Window.prototype, /** @lends App.prototype */{
      displayName: "Window",
      storeName: null,
      dispatcherName: null,
      eventEmitterName: null,
      params: null,
    });

    return Window;
  })
};
