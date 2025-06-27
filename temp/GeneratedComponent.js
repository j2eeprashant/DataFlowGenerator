"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var GeneratedComponent = function GeneratedComponent(_ref) {
  var onSubmit = _ref.onSubmit;
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    inputnode = _useState2[0],
    setInputnode = _useState2[1];
  var processData = (0, _react.useCallback)(function (input) {
    // Process the input data
    return input.trim();
  }, []);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    className: "block text-sm font-medium text-gray-700 mb-2"
  }, "Input Node"), /*#__PURE__*/_react["default"].createElement("input", {
    type: "text",
    value: inputnode,
    onChange: function onChange(e) {
      return setInputnode(e.target.value);
    },
    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    placeholder: "Enter input node"
  })), /*#__PURE__*/_react["default"].createElement("button", {
    onClick: function onClick() {
      try {
        var result = processData(inputnode);
        console.log('Processed result:', result);
        onSubmit === null || onSubmit === void 0 || onSubmit(result);
      } catch (error) {
        console.error('Processing failed:', error);
      }
    },
    className: "w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
  }, "Process Data"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md"
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    className: "text-sm font-medium text-gray-800"
  }, "Output Node:"), /*#__PURE__*/_react["default"].createElement("p", {
    className: "text-sm text-gray-600"
  }, "Results will be displayed here")));
};
var _default = exports["default"] = GeneratedComponent;