/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 745:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(533);
if (true) {
  exports.createRoot = m.createRoot;
  exports.hydrateRoot = m.hydrateRoot;
} else { var i; }


/***/ }),

/***/ 533:
/***/ ((module) => {

module.exports = ReactDOM;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: external "React"
const external_React_namespaceObject = React;
var external_React_default = /*#__PURE__*/__webpack_require__.n(external_React_namespaceObject);
// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(745);
;// CONCATENATED MODULE: external "antd"
const external_antd_namespaceObject = antd;
;// CONCATENATED MODULE: ./src/gh-pages/GhPagesApp.tsx


function GhPagesApp() {
  const [treeData, setTreeData] = external_React_default().useState([]);
  const [iframe, setIframe] = external_React_default().useState('');
  const read = (value, key, url) => {
    if (typeof value === 'string') {
      return {
        title: `${key}(${value})`,
        key: url,
        isLeaf: true
      };
    } else {
      let children = [];
      let dataNode = {
        title: key,
        key: url,
        children,
        isLeaf: false
      };
      Object.entries(value).forEach(([key, value]) => {
        children.push(read(value, key, url + '/' + key));
      });
      return dataNode;
    }
  };
  external_React_default().useEffect(() => {
    fetch('./data.json').then(res => {
      res.json().then(json => {
        let main = read(json, '', '');
        setTreeData(main.children);
      });
    });
  }, []);
  return external_React_default().createElement((external_React_default()).Fragment, null, external_React_default().createElement(external_antd_namespaceObject.Tree.DirectoryTree, {
    showLine: true,
    treeData: treeData,
    onSelect: (keys, event) => {
      if (event.node.isLeaf && keys.length > 0) {
        setIframe(`./iframes${keys[0]}.html`);
      }
    }
  }), external_React_default().createElement("iframe", {
    style: {
      width: '100%',
      height: '500px'
    },
    src: iframe
  }));
}
;// CONCATENATED MODULE: ./src/gh-pages/index.tsx



const root = client.createRoot(document.getElementById('root'));
root.render(external_React_default().createElement((external_React_default()).Fragment, null, external_React_default().createElement(GhPagesApp, null)));
})();

/******/ })()
;