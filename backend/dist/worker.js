// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  if (mod && typeof mod === "object" || typeof mod === "function") {
    for (let key of __getOwnPropNames(mod))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: __accessProp.bind(mod, key),
          enumerable: true
        });
  }
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = import.meta.require;

// node_modules/dotenv/lib/main.js
var require_main = __commonJS(function(exports, module) {
  var fs = __require("fs");
  var path = __require("path");
  var os = __require("os");
  var crypto2 = __require("crypto");
  var TIPS = [
    "\u25C8 encrypted .env [www.dotenvx.com]",
    "\u25C8 secrets for agents [www.dotenvx.com]",
    "\u2301 auth for agents [www.vestauth.com]",
    "\u2318 custom filepath { path: '/custom/path/.env' }",
    "\u2318 enable debugging { debug: true }",
    "\u2318 override existing { override: true }",
    "\u2318 suppress logs { quiet: true }",
    "\u2318 multiple files { path: ['.env.local', '.env'] }"
  ];
  function _getRandomTip() {
    return TIPS[Math.floor(Math.random() * TIPS.length)];
  }
  function parseBoolean(value) {
    if (typeof value === "string") {
      return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
    }
    return Boolean(value);
  }
  function supportsAnsi() {
    return process.stdout.isTTY;
  }
  function dim(text) {
    return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
  }
  var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function parse(src) {
    const obj = {};
    let lines = src.toString();
    lines = lines.replace(/\r\n?/mg, `
`);
    let match;
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim();
      const maybeQuote = value[0];
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, `
`);
        value = value.replace(/\\r/g, "\r");
      }
      obj[key] = value;
    }
    return obj;
  }
  function _parseVault(options) {
    options = options || {};
    const vaultPath = _vaultPath(options);
    options.path = vaultPath;
    const result = DotenvModule.configDotenv(options);
    if (!result.parsed) {
      const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      err.code = "MISSING_DATA";
      throw err;
    }
    const keys = _dotenvKey(options).split(",");
    const length = keys.length;
    let decrypted;
    for (let i = 0;i < length; i++) {
      try {
        const key = keys[i].trim();
        const attrs = _instructions(result, key);
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
        break;
      } catch (error) {
        if (i + 1 >= length) {
          throw error;
        }
      }
    }
    return DotenvModule.parse(decrypted);
  }
  function _warn(message) {
    console.error(`\u26A0 ${message}`);
  }
  function _debug(message) {
    console.log(`\u2506 ${message}`);
  }
  function _log(message) {
    console.log(`\u25C7 ${message}`);
  }
  function _dotenvKey(options) {
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }
    return "";
  }
  function _instructions(result, dotenvKey) {
    let uri;
    try {
      uri = new URL(dotenvKey);
    } catch (error) {
      if (error.code === "ERR_INVALID_URL") {
        const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      throw error;
    }
    const key = uri.password;
    if (!key) {
      const err = new Error("INVALID_DOTENV_KEY: Missing key part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environment = uri.searchParams.get("environment");
    if (!environment) {
      const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey];
    if (!ciphertext) {
      const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
      throw err;
    }
    return { ciphertext, key };
  }
  function _vaultPath(options) {
    let possibleVaultPath = null;
    if (options && options.path && options.path.length > 0) {
      if (Array.isArray(options.path)) {
        for (const filepath of options.path) {
          if (fs.existsSync(filepath)) {
            possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
          }
        }
      } else {
        possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
      }
    } else {
      possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
    }
    if (fs.existsSync(possibleVaultPath)) {
      return possibleVaultPath;
    }
    return null;
  }
  function _resolveHome(envPath) {
    return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
  }
  function _configVault(options) {
    const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
    const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
    if (debug || !quiet) {
      _log("loading env from encrypted .env.vault");
    }
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return { parsed };
  }
  function configDotenv(options) {
    const dotenvPath = path.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
    let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
    if (options && options.encoding) {
      encoding = options.encoding;
    } else {
      if (debug) {
        _debug("no encoding is specified (UTF-8 is used by default)");
      }
    }
    let optionPaths = [dotenvPath];
    if (options && options.path) {
      if (!Array.isArray(options.path)) {
        optionPaths = [_resolveHome(options.path)];
      } else {
        optionPaths = [];
        for (const filepath of options.path) {
          optionPaths.push(_resolveHome(filepath));
        }
      }
    }
    let lastError;
    const parsedAll = {};
    for (const path of optionPaths) {
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }));
        DotenvModule.populate(parsedAll, parsed, options);
      } catch (e) {
        if (debug) {
          _debug(`failed to load ${path} ${e.message}`);
        }
        lastError = e;
      }
    }
    const populated = DotenvModule.populate(processEnv, parsedAll, options);
    debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
    quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
    if (debug || !quiet) {
      const keysCount = Object.keys(populated).length;
      const shortPaths = [];
      for (const filePath of optionPaths) {
        try {
          const relative2 = path.relative(process.cwd(), filePath);
          shortPaths.push(relative2);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${filePath} ${e.message}`);
          }
          lastError = e;
        }
      }
      _log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
    }
    if (lastError) {
      return { parsed: parsedAll, error: lastError };
    } else {
      return { parsed: parsedAll };
    }
  }
  function config(options) {
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);
    if (!vaultPath) {
      _warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  }
  function decrypt(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), "hex");
    let ciphertext = Buffer.from(encrypted, "base64");
    const nonce = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(-16);
    ciphertext = ciphertext.subarray(12, -16);
    try {
      const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
      aesgcm.setAuthTag(authTag);
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
      const isRange = error instanceof RangeError;
      const invalidKeyLength = error.message === "Invalid key length";
      const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
      if (isRange || invalidKeyLength) {
        const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      } else if (decryptionFailed) {
        const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        err.code = "DECRYPTION_FAILED";
        throw err;
      } else {
        throw error;
      }
    }
  }
  function populate(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    const populated = {};
    if (typeof parsed !== "object") {
      const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      err.code = "OBJECT_REQUIRED";
      throw err;
    }
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
        if (debug) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`);
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`);
          }
        }
      } else {
        processEnv[key] = parsed[key];
        populated[key] = parsed[key];
      }
    }
    return populated;
  }
  var DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate
  };
  module.exports.configDotenv = DotenvModule.configDotenv;
  module.exports._configVault = DotenvModule._configVault;
  module.exports._parseVault = DotenvModule._parseVault;
  module.exports.config = DotenvModule.config;
  module.exports.decrypt = DotenvModule.decrypt;
  module.exports.parse = DotenvModule.parse;
  module.exports.populate = DotenvModule.populate;
  module.exports = DotenvModule;
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS(function(exports, module) {
  var options = {};
  if (process.env.DOTENV_CONFIG_ENCODING != null) {
    options.encoding = process.env.DOTENV_CONFIG_ENCODING;
  }
  if (process.env.DOTENV_CONFIG_PATH != null) {
    options.path = process.env.DOTENV_CONFIG_PATH;
  }
  if (process.env.DOTENV_CONFIG_QUIET != null) {
    options.quiet = process.env.DOTENV_CONFIG_QUIET;
  }
  if (process.env.DOTENV_CONFIG_DEBUG != null) {
    options.debug = process.env.DOTENV_CONFIG_DEBUG;
  }
  if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
    options.override = process.env.DOTENV_CONFIG_OVERRIDE;
  }
  if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
    options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
  }
  module.exports = options;
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS(function(exports, module) {
  var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
  module.exports = function optionMatcher(args) {
    const options = args.reduce(function(acc, cur) {
      const matches = cur.match(re);
      if (matches) {
        acc[matches[1]] = matches[2];
      }
      return acc;
    }, {});
    if (!("quiet" in options)) {
      options.quiet = "true";
    }
    return options;
  };
});

// node_modules/dotenv/config.js
var require_config = __commonJS(function() {
  (function() {
    require_main().config(Object.assign({}, require_env_options(), require_cli_options()(process.argv)));
  })();
});

// node_modules/postgres-array/index.js
var require_postgres_array = __commonJS(function(exports) {
  exports.parse = function(source, transform) {
    return new ArrayParser(source, transform).parse();
  };

  class ArrayParser {
    constructor(source, transform) {
      this.source = source;
      this.transform = transform || identity;
      this.position = 0;
      this.entries = [];
      this.recorded = [];
      this.dimension = 0;
    }
    isEof() {
      return this.position >= this.source.length;
    }
    nextCharacter() {
      var character = this.source[this.position++];
      if (character === "\\") {
        return {
          value: this.source[this.position++],
          escaped: true
        };
      }
      return {
        value: character,
        escaped: false
      };
    }
    record(character) {
      this.recorded.push(character);
    }
    newEntry(includeEmpty) {
      var entry;
      if (this.recorded.length > 0 || includeEmpty) {
        entry = this.recorded.join("");
        if (entry === "NULL" && !includeEmpty) {
          entry = null;
        }
        if (entry !== null)
          entry = this.transform(entry);
        this.entries.push(entry);
        this.recorded = [];
      }
    }
    consumeDimensions() {
      if (this.source[0] === "[") {
        while (!this.isEof()) {
          var char = this.nextCharacter();
          if (char.value === "=")
            break;
        }
      }
    }
    parse(nested) {
      var character, parser, quote;
      this.consumeDimensions();
      while (!this.isEof()) {
        character = this.nextCharacter();
        if (character.value === "{" && !quote) {
          this.dimension++;
          if (this.dimension > 1) {
            parser = new ArrayParser(this.source.substr(this.position - 1), this.transform);
            this.entries.push(parser.parse(true));
            this.position += parser.position - 2;
          }
        } else if (character.value === "}" && !quote) {
          this.dimension--;
          if (!this.dimension) {
            this.newEntry();
            if (nested)
              return this.entries;
          }
        } else if (character.value === '"' && !character.escaped) {
          if (quote)
            this.newEntry(true);
          quote = !quote;
        } else if (character.value === "," && !quote) {
          this.newEntry();
        } else {
          this.record(character.value);
        }
      }
      if (this.dimension !== 0) {
        throw new Error("array dimension not balanced");
      }
      return this.entries;
    }
  }
  function identity(value) {
    return value;
  }
});

// node_modules/pg-types/lib/arrayParser.js
var require_arrayParser = __commonJS(function(exports, module) {
  var array = require_postgres_array();
  module.exports = {
    create: function(source, transform) {
      return {
        parse: function() {
          return array.parse(source, transform);
        }
      };
    }
  };
});

// node_modules/postgres-date/index.js
var require_postgres_date = __commonJS(function(exports, module) {
  var DATE_TIME = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/;
  var DATE = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/;
  var TIME_ZONE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
  var INFINITY = /^-?infinity$/;
  module.exports = function parseDate(isoDate) {
    if (INFINITY.test(isoDate)) {
      return Number(isoDate.replace("i", "I"));
    }
    var matches = DATE_TIME.exec(isoDate);
    if (!matches) {
      return getDate(isoDate) || null;
    }
    var isBC = !!matches[8];
    var year = parseInt(matches[1], 10);
    if (isBC) {
      year = bcYearToNegativeYear(year);
    }
    var month = parseInt(matches[2], 10) - 1;
    var day = matches[3];
    var hour = parseInt(matches[4], 10);
    var minute = parseInt(matches[5], 10);
    var second = parseInt(matches[6], 10);
    var ms = matches[7];
    ms = ms ? 1000 * parseFloat(ms) : 0;
    var date;
    var offset = timeZoneOffset(isoDate);
    if (offset != null) {
      date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
      if (is0To99(year)) {
        date.setUTCFullYear(year);
      }
      if (offset !== 0) {
        date.setTime(date.getTime() - offset);
      }
    } else {
      date = new Date(year, month, day, hour, minute, second, ms);
      if (is0To99(year)) {
        date.setFullYear(year);
      }
    }
    return date;
  };
  function getDate(isoDate) {
    var matches = DATE.exec(isoDate);
    if (!matches) {
      return;
    }
    var year = parseInt(matches[1], 10);
    var isBC = !!matches[4];
    if (isBC) {
      year = bcYearToNegativeYear(year);
    }
    var month = parseInt(matches[2], 10) - 1;
    var day = matches[3];
    var date = new Date(year, month, day);
    if (is0To99(year)) {
      date.setFullYear(year);
    }
    return date;
  }
  function timeZoneOffset(isoDate) {
    if (isoDate.endsWith("+00")) {
      return 0;
    }
    var zone = TIME_ZONE.exec(isoDate.split(" ")[1]);
    if (!zone)
      return;
    var type = zone[1];
    if (type === "Z") {
      return 0;
    }
    var sign = type === "-" ? -1 : 1;
    var offset = parseInt(zone[2], 10) * 3600 + parseInt(zone[3] || 0, 10) * 60 + parseInt(zone[4] || 0, 10);
    return offset * sign * 1000;
  }
  function bcYearToNegativeYear(year) {
    return -(year - 1);
  }
  function is0To99(num) {
    return num >= 0 && num < 100;
  }
});

// node_modules/xtend/mutable.js
var require_mutable = __commonJS(function(exports, module) {
  module.exports = extend;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function extend(target) {
    for (var i = 1;i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  }
});

// node_modules/postgres-interval/index.js
var require_postgres_interval = __commonJS(function(exports, module) {
  var extend = require_mutable();
  module.exports = PostgresInterval;
  function PostgresInterval(raw) {
    if (!(this instanceof PostgresInterval)) {
      return new PostgresInterval(raw);
    }
    extend(this, parse(raw));
  }
  var properties = ["seconds", "minutes", "hours", "days", "months", "years"];
  PostgresInterval.prototype.toPostgres = function() {
    var filtered = properties.filter(this.hasOwnProperty, this);
    if (this.milliseconds && filtered.indexOf("seconds") < 0) {
      filtered.push("seconds");
    }
    if (filtered.length === 0)
      return "0";
    return filtered.map(function(property) {
      var value = this[property] || 0;
      if (property === "seconds" && this.milliseconds) {
        value = (value + this.milliseconds / 1000).toFixed(6).replace(/\.?0+$/, "");
      }
      return value + " " + property;
    }, this).join(" ");
  };
  var propertiesISOEquivalent = {
    years: "Y",
    months: "M",
    days: "D",
    hours: "H",
    minutes: "M",
    seconds: "S"
  };
  var dateProperties = ["years", "months", "days"];
  var timeProperties = ["hours", "minutes", "seconds"];
  PostgresInterval.prototype.toISOString = PostgresInterval.prototype.toISO = function() {
    var datePart = dateProperties.map(buildProperty, this).join("");
    var timePart = timeProperties.map(buildProperty, this).join("");
    return "P" + datePart + "T" + timePart;
    function buildProperty(property) {
      var value = this[property] || 0;
      if (property === "seconds" && this.milliseconds) {
        value = (value + this.milliseconds / 1000).toFixed(6).replace(/0+$/, "");
      }
      return value + propertiesISOEquivalent[property];
    }
  };
  var NUMBER = "([+-]?\\d+)";
  var YEAR = NUMBER + "\\s+years?";
  var MONTH = NUMBER + "\\s+mons?";
  var DAY = NUMBER + "\\s+days?";
  var TIME = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?";
  var INTERVAL = new RegExp([YEAR, MONTH, DAY, TIME].map(function(regexString) {
    return "(" + regexString + ")?";
  }).join("\\s*"));
  var positions = {
    years: 2,
    months: 4,
    days: 6,
    hours: 9,
    minutes: 10,
    seconds: 11,
    milliseconds: 12
  };
  var negatives = ["hours", "minutes", "seconds", "milliseconds"];
  function parseMilliseconds(fraction) {
    var microseconds = fraction + "000000".slice(fraction.length);
    return parseInt(microseconds, 10) / 1000;
  }
  function parse(interval) {
    if (!interval)
      return {};
    var matches = INTERVAL.exec(interval);
    var isNegative = matches[8] === "-";
    return Object.keys(positions).reduce(function(parsed, property) {
      var position = positions[property];
      var value = matches[position];
      if (!value)
        return parsed;
      value = property === "milliseconds" ? parseMilliseconds(value) : parseInt(value, 10);
      if (!value)
        return parsed;
      if (isNegative && ~negatives.indexOf(property)) {
        value *= -1;
      }
      parsed[property] = value;
      return parsed;
    }, {});
  }
});

// node_modules/postgres-bytea/index.js
var require_postgres_bytea = __commonJS(function(exports, module) {
  var bufferFrom = Buffer.from || Buffer;
  module.exports = function parseBytea(input) {
    if (/^\\x/.test(input)) {
      return bufferFrom(input.substr(2), "hex");
    }
    var output = "";
    var i = 0;
    while (i < input.length) {
      if (input[i] !== "\\") {
        output += input[i];
        ++i;
      } else {
        if (/[0-7]{3}/.test(input.substr(i + 1, 3))) {
          output += String.fromCharCode(parseInt(input.substr(i + 1, 3), 8));
          i += 4;
        } else {
          var backslashes = 1;
          while (i + backslashes < input.length && input[i + backslashes] === "\\") {
            backslashes++;
          }
          for (var k = 0;k < Math.floor(backslashes / 2); ++k) {
            output += "\\";
          }
          i += Math.floor(backslashes / 2) * 2;
        }
      }
    }
    return bufferFrom(output, "binary");
  };
});

// node_modules/pg-types/lib/textParsers.js
var require_textParsers = __commonJS(function(exports, module) {
  var array = require_postgres_array();
  var arrayParser = require_arrayParser();
  var parseDate = require_postgres_date();
  var parseInterval = require_postgres_interval();
  var parseByteA = require_postgres_bytea();
  function allowNull(fn) {
    return function nullAllowed(value) {
      if (value === null)
        return value;
      return fn(value);
    };
  }
  function parseBool(value) {
    if (value === null)
      return value;
    return value === "TRUE" || value === "t" || value === "true" || value === "y" || value === "yes" || value === "on" || value === "1";
  }
  function parseBoolArray(value) {
    if (!value)
      return null;
    return array.parse(value, parseBool);
  }
  function parseBaseTenInt(string) {
    return parseInt(string, 10);
  }
  function parseIntegerArray(value) {
    if (!value)
      return null;
    return array.parse(value, allowNull(parseBaseTenInt));
  }
  function parseBigIntegerArray(value) {
    if (!value)
      return null;
    return array.parse(value, allowNull(function(entry) {
      return parseBigInteger(entry).trim();
    }));
  }
  var parsePointArray = function(value) {
    if (!value) {
      return null;
    }
    var p = arrayParser.create(value, function(entry) {
      if (entry !== null) {
        entry = parsePoint(entry);
      }
      return entry;
    });
    return p.parse();
  };
  var parseFloatArray = function(value) {
    if (!value) {
      return null;
    }
    var p = arrayParser.create(value, function(entry) {
      if (entry !== null) {
        entry = parseFloat(entry);
      }
      return entry;
    });
    return p.parse();
  };
  var parseStringArray = function(value) {
    if (!value) {
      return null;
    }
    var p = arrayParser.create(value);
    return p.parse();
  };
  var parseDateArray = function(value) {
    if (!value) {
      return null;
    }
    var p = arrayParser.create(value, function(entry) {
      if (entry !== null) {
        entry = parseDate(entry);
      }
      return entry;
    });
    return p.parse();
  };
  var parseIntervalArray = function(value) {
    if (!value) {
      return null;
    }
    var p = arrayParser.create(value, function(entry) {
      if (entry !== null) {
        entry = parseInterval(entry);
      }
      return entry;
    });
    return p.parse();
  };
  var parseByteAArray = function(value) {
    if (!value) {
      return null;
    }
    return array.parse(value, allowNull(parseByteA));
  };
  var parseInteger = function(value) {
    return parseInt(value, 10);
  };
  var parseBigInteger = function(value) {
    var valStr = String(value);
    if (/^\d+$/.test(valStr)) {
      return valStr;
    }
    return value;
  };
  var parseJsonArray = function(value) {
    if (!value) {
      return null;
    }
    return array.parse(value, allowNull(JSON.parse));
  };
  var parsePoint = function(value) {
    if (value[0] !== "(") {
      return null;
    }
    value = value.substring(1, value.length - 1).split(",");
    return {
      x: parseFloat(value[0]),
      y: parseFloat(value[1])
    };
  };
  var parseCircle = function(value) {
    if (value[0] !== "<" && value[1] !== "(") {
      return null;
    }
    var point = "(";
    var radius = "";
    var pointParsed = false;
    for (var i = 2;i < value.length - 1; i++) {
      if (!pointParsed) {
        point += value[i];
      }
      if (value[i] === ")") {
        pointParsed = true;
        continue;
      } else if (!pointParsed) {
        continue;
      }
      if (value[i] === ",") {
        continue;
      }
      radius += value[i];
    }
    var result = parsePoint(point);
    result.radius = parseFloat(radius);
    return result;
  };
  var init = function(register) {
    register(20, parseBigInteger);
    register(21, parseInteger);
    register(23, parseInteger);
    register(26, parseInteger);
    register(700, parseFloat);
    register(701, parseFloat);
    register(16, parseBool);
    register(1082, parseDate);
    register(1114, parseDate);
    register(1184, parseDate);
    register(600, parsePoint);
    register(651, parseStringArray);
    register(718, parseCircle);
    register(1000, parseBoolArray);
    register(1001, parseByteAArray);
    register(1005, parseIntegerArray);
    register(1007, parseIntegerArray);
    register(1028, parseIntegerArray);
    register(1016, parseBigIntegerArray);
    register(1017, parsePointArray);
    register(1021, parseFloatArray);
    register(1022, parseFloatArray);
    register(1231, parseFloatArray);
    register(1014, parseStringArray);
    register(1015, parseStringArray);
    register(1008, parseStringArray);
    register(1009, parseStringArray);
    register(1040, parseStringArray);
    register(1041, parseStringArray);
    register(1115, parseDateArray);
    register(1182, parseDateArray);
    register(1185, parseDateArray);
    register(1186, parseInterval);
    register(1187, parseIntervalArray);
    register(17, parseByteA);
    register(114, JSON.parse.bind(JSON));
    register(3802, JSON.parse.bind(JSON));
    register(199, parseJsonArray);
    register(3807, parseJsonArray);
    register(3907, parseStringArray);
    register(2951, parseStringArray);
    register(791, parseStringArray);
    register(1183, parseStringArray);
    register(1270, parseStringArray);
  };
  module.exports = {
    init
  };
});

// node_modules/pg-int8/index.js
var require_pg_int8 = __commonJS(function(exports, module) {
  var BASE = 1e6;
  function readInt8(buffer) {
    var high = buffer.readInt32BE(0);
    var low = buffer.readUInt32BE(4);
    var sign = "";
    if (high < 0) {
      high = ~high + (low === 0);
      low = ~low + 1 >>> 0;
      sign = "-";
    }
    var result = "";
    var carry;
    var t;
    var digits;
    var pad;
    var l;
    var i;
    {
      carry = high % BASE;
      high = high / BASE >>> 0;
      t = 4294967296 * carry + low;
      low = t / BASE >>> 0;
      digits = "" + (t - BASE * low);
      if (low === 0 && high === 0) {
        return sign + digits + result;
      }
      pad = "";
      l = 6 - digits.length;
      for (i = 0;i < l; i++) {
        pad += "0";
      }
      result = pad + digits + result;
    }
    {
      carry = high % BASE;
      high = high / BASE >>> 0;
      t = 4294967296 * carry + low;
      low = t / BASE >>> 0;
      digits = "" + (t - BASE * low);
      if (low === 0 && high === 0) {
        return sign + digits + result;
      }
      pad = "";
      l = 6 - digits.length;
      for (i = 0;i < l; i++) {
        pad += "0";
      }
      result = pad + digits + result;
    }
    {
      carry = high % BASE;
      high = high / BASE >>> 0;
      t = 4294967296 * carry + low;
      low = t / BASE >>> 0;
      digits = "" + (t - BASE * low);
      if (low === 0 && high === 0) {
        return sign + digits + result;
      }
      pad = "";
      l = 6 - digits.length;
      for (i = 0;i < l; i++) {
        pad += "0";
      }
      result = pad + digits + result;
    }
    {
      carry = high % BASE;
      t = 4294967296 * carry + low;
      digits = "" + t % BASE;
      return sign + digits + result;
    }
  }
  module.exports = readInt8;
});

// node_modules/pg-types/lib/binaryParsers.js
var require_binaryParsers = __commonJS(function(exports, module) {
  var parseInt64 = require_pg_int8();
  var parseBits = function(data, bits, offset, invert, callback) {
    offset = offset || 0;
    invert = invert || false;
    callback = callback || function(lastValue, newValue, bits) {
      return lastValue * Math.pow(2, bits) + newValue;
    };
    var offsetBytes = offset >> 3;
    var inv = function(value) {
      if (invert) {
        return ~value & 255;
      }
      return value;
    };
    var mask = 255;
    var firstBits = 8 - offset % 8;
    if (bits < firstBits) {
      mask = 255 << 8 - bits & 255;
      firstBits = bits;
    }
    if (offset) {
      mask = mask >> offset % 8;
    }
    var result = 0;
    if (offset % 8 + bits >= 8) {
      result = callback(0, inv(data[offsetBytes]) & mask, firstBits);
    }
    var bytes = bits + offset >> 3;
    for (var i = offsetBytes + 1;i < bytes; i++) {
      result = callback(result, inv(data[i]), 8);
    }
    var lastBits = (bits + offset) % 8;
    if (lastBits > 0) {
      result = callback(result, inv(data[bytes]) >> 8 - lastBits, lastBits);
    }
    return result;
  };
  var parseFloatFromBits = function(data, precisionBits, exponentBits) {
    var bias = Math.pow(2, exponentBits - 1) - 1;
    var sign = parseBits(data, 1);
    var exponent = parseBits(data, exponentBits, 1);
    if (exponent === 0) {
      return 0;
    }
    var precisionBitsCounter = 1;
    var parsePrecisionBits = function(lastValue, newValue, bits) {
      if (lastValue === 0) {
        lastValue = 1;
      }
      for (var i = 1;i <= bits; i++) {
        precisionBitsCounter /= 2;
        if ((newValue & 1 << bits - i) > 0) {
          lastValue += precisionBitsCounter;
        }
      }
      return lastValue;
    };
    var mantissa = parseBits(data, precisionBits, exponentBits + 1, false, parsePrecisionBits);
    if (exponent == Math.pow(2, exponentBits + 1) - 1) {
      if (mantissa === 0) {
        return sign === 0 ? Infinity : -Infinity;
      }
      return NaN;
    }
    return (sign === 0 ? 1 : -1) * Math.pow(2, exponent - bias) * mantissa;
  };
  var parseInt16 = function(value) {
    if (parseBits(value, 1) == 1) {
      return -1 * (parseBits(value, 15, 1, true) + 1);
    }
    return parseBits(value, 15, 1);
  };
  var parseInt32 = function(value) {
    if (parseBits(value, 1) == 1) {
      return -1 * (parseBits(value, 31, 1, true) + 1);
    }
    return parseBits(value, 31, 1);
  };
  var parseFloat32 = function(value) {
    return parseFloatFromBits(value, 23, 8);
  };
  var parseFloat64 = function(value) {
    return parseFloatFromBits(value, 52, 11);
  };
  var parseNumeric = function(value) {
    var sign = parseBits(value, 16, 32);
    if (sign == 49152) {
      return NaN;
    }
    var weight = Math.pow(1e4, parseBits(value, 16, 16));
    var result = 0;
    var digits = [];
    var ndigits = parseBits(value, 16);
    for (var i = 0;i < ndigits; i++) {
      result += parseBits(value, 16, 64 + 16 * i) * weight;
      weight /= 1e4;
    }
    var scale = Math.pow(10, parseBits(value, 16, 48));
    return (sign === 0 ? 1 : -1) * Math.round(result * scale) / scale;
  };
  var parseDate = function(isUTC, value) {
    var sign = parseBits(value, 1);
    var rawValue = parseBits(value, 63, 1);
    var result = new Date((sign === 0 ? 1 : -1) * rawValue / 1000 + 946684800000);
    if (!isUTC) {
      result.setTime(result.getTime() + result.getTimezoneOffset() * 60000);
    }
    result.usec = rawValue % 1000;
    result.getMicroSeconds = function() {
      return this.usec;
    };
    result.setMicroSeconds = function(value) {
      this.usec = value;
    };
    result.getUTCMicroSeconds = function() {
      return this.usec;
    };
    return result;
  };
  var parseArray = function(value) {
    var dim = parseBits(value, 32);
    var flags = parseBits(value, 32, 32);
    var elementType = parseBits(value, 32, 64);
    var offset = 96;
    var dims = [];
    for (var i = 0;i < dim; i++) {
      dims[i] = parseBits(value, 32, offset);
      offset += 32;
      offset += 32;
    }
    var parseElement = function(elementType) {
      var length = parseBits(value, 32, offset);
      offset += 32;
      if (length == 4294967295) {
        return null;
      }
      var result;
      if (elementType == 23 || elementType == 20) {
        result = parseBits(value, length * 8, offset);
        offset += length * 8;
        return result;
      } else if (elementType == 25) {
        result = value.toString(this.encoding, offset >> 3, (offset += length << 3) >> 3);
        return result;
      } else {
        console.log("ERROR: ElementType not implemented: " + elementType);
      }
    };
    var parse = function(dimension, elementType) {
      var array = [];
      var i;
      if (dimension.length > 1) {
        var count = dimension.shift();
        for (i = 0;i < count; i++) {
          array[i] = parse(dimension, elementType);
        }
        dimension.unshift(count);
      } else {
        for (i = 0;i < dimension[0]; i++) {
          array[i] = parseElement(elementType);
        }
      }
      return array;
    };
    return parse(dims, elementType);
  };
  var parseText = function(value) {
    return value.toString("utf8");
  };
  var parseBool = function(value) {
    if (value === null)
      return null;
    return parseBits(value, 8) > 0;
  };
  var init = function(register) {
    register(20, parseInt64);
    register(21, parseInt16);
    register(23, parseInt32);
    register(26, parseInt32);
    register(1700, parseNumeric);
    register(700, parseFloat32);
    register(701, parseFloat64);
    register(16, parseBool);
    register(1114, parseDate.bind(null, false));
    register(1184, parseDate.bind(null, true));
    register(1000, parseArray);
    register(1007, parseArray);
    register(1016, parseArray);
    register(1008, parseArray);
    register(1009, parseArray);
    register(25, parseText);
  };
  module.exports = {
    init
  };
});

// node_modules/pg-types/lib/builtins.js
var require_builtins = __commonJS(function(exports, module) {
  module.exports = {
    BOOL: 16,
    BYTEA: 17,
    CHAR: 18,
    INT8: 20,
    INT2: 21,
    INT4: 23,
    REGPROC: 24,
    TEXT: 25,
    OID: 26,
    TID: 27,
    XID: 28,
    CID: 29,
    JSON: 114,
    XML: 142,
    PG_NODE_TREE: 194,
    SMGR: 210,
    PATH: 602,
    POLYGON: 604,
    CIDR: 650,
    FLOAT4: 700,
    FLOAT8: 701,
    ABSTIME: 702,
    RELTIME: 703,
    TINTERVAL: 704,
    CIRCLE: 718,
    MACADDR8: 774,
    MONEY: 790,
    MACADDR: 829,
    INET: 869,
    ACLITEM: 1033,
    BPCHAR: 1042,
    VARCHAR: 1043,
    DATE: 1082,
    TIME: 1083,
    TIMESTAMP: 1114,
    TIMESTAMPTZ: 1184,
    INTERVAL: 1186,
    TIMETZ: 1266,
    BIT: 1560,
    VARBIT: 1562,
    NUMERIC: 1700,
    REFCURSOR: 1790,
    REGPROCEDURE: 2202,
    REGOPER: 2203,
    REGOPERATOR: 2204,
    REGCLASS: 2205,
    REGTYPE: 2206,
    UUID: 2950,
    TXID_SNAPSHOT: 2970,
    PG_LSN: 3220,
    PG_NDISTINCT: 3361,
    PG_DEPENDENCIES: 3402,
    TSVECTOR: 3614,
    TSQUERY: 3615,
    GTSVECTOR: 3642,
    REGCONFIG: 3734,
    REGDICTIONARY: 3769,
    JSONB: 3802,
    REGNAMESPACE: 4089,
    REGROLE: 4096
  };
});

// node_modules/pg-types/index.js
var require_pg_types = __commonJS(function(exports) {
  var textParsers = require_textParsers();
  var binaryParsers = require_binaryParsers();
  var arrayParser = require_arrayParser();
  var builtinTypes = require_builtins();
  exports.getTypeParser = getTypeParser;
  exports.setTypeParser = setTypeParser;
  exports.arrayParser = arrayParser;
  exports.builtins = builtinTypes;
  var typeParsers = {
    text: {},
    binary: {}
  };
  function noParse(val) {
    return String(val);
  }
  function getTypeParser(oid, format) {
    format = format || "text";
    if (!typeParsers[format]) {
      return noParse;
    }
    return typeParsers[format][oid] || noParse;
  }
  function setTypeParser(oid, format, parseFn) {
    if (typeof format == "function") {
      parseFn = format;
      format = "text";
    }
    typeParsers[format][oid] = parseFn;
  }
  textParsers.init(function(oid, converter) {
    typeParsers.text[oid] = converter;
  });
  binaryParsers.init(function(oid, converter) {
    typeParsers.binary[oid] = converter;
  });
});

// node_modules/pg/lib/defaults.js
var require_defaults = __commonJS(function(exports, module) {
  var user;
  try {
    user = process.platform === "win32" ? process.env.USERNAME : process.env.USER;
  } catch {}
  module.exports = {
    host: "localhost",
    user,
    database: undefined,
    password: null,
    connectionString: undefined,
    port: 5432,
    rows: 0,
    binary: false,
    max: 10,
    idleTimeoutMillis: 30000,
    client_encoding: "",
    ssl: false,
    sslnegotiation: undefined,
    application_name: undefined,
    fallback_application_name: undefined,
    options: undefined,
    parseInputDatesAsUTC: false,
    statement_timeout: false,
    lock_timeout: false,
    idle_in_transaction_session_timeout: false,
    query_timeout: false,
    connect_timeout: 0,
    keepalives: 1,
    keepalives_idle: 0
  };
  var pgTypes = require_pg_types();
  var parseBigInteger = pgTypes.getTypeParser(20, "text");
  var parseBigIntegerArray = pgTypes.getTypeParser(1016, "text");
  module.exports.__defineSetter__("parseInt8", function(val) {
    pgTypes.setTypeParser(20, "text", val ? pgTypes.getTypeParser(23, "text") : parseBigInteger);
    pgTypes.setTypeParser(1016, "text", val ? pgTypes.getTypeParser(1007, "text") : parseBigIntegerArray);
  });
});

// node_modules/pg/lib/utils.js
var require_utils = __commonJS(function(exports, module) {
  var defaults = require_defaults();
  var { isDate } = __require("util/types");
  function escapeElement(elementRepresentation) {
    const escaped = elementRepresentation.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
    return '"' + escaped + '"';
  }
  function arrayString(val) {
    let result = "{";
    for (let i = 0;i < val.length; i++) {
      if (i > 0) {
        result += ",";
      }
      let item = val[i];
      if (item == null) {
        result += "NULL";
      } else if (Array.isArray(item)) {
        result += arrayString(item);
      } else if (ArrayBuffer.isView(item)) {
        if (!(item instanceof Buffer)) {
          item = Buffer.from(item.buffer, item.byteOffset, item.byteLength);
        }
        result += "\\\\x" + item.toString("hex");
      } else {
        result += escapeElement(prepareValue(item));
      }
    }
    result += "}";
    return result;
  }
  var prepareValue = function(val, seen) {
    if (val == null) {
      return null;
    }
    if (typeof val === "object") {
      if (val instanceof Buffer) {
        return val;
      }
      if (ArrayBuffer.isView(val)) {
        return Buffer.from(val.buffer, val.byteOffset, val.byteLength);
      }
      if (isDate(val)) {
        if (defaults.parseInputDatesAsUTC) {
          return dateToStringUTC(val);
        } else {
          return dateToString(val);
        }
      }
      if (Array.isArray(val)) {
        return arrayString(val);
      }
      return prepareObject(val, seen);
    }
    return val.toString();
  };
  function prepareObject(val, seen) {
    if (val && typeof val.toPostgres === "function") {
      seen = seen || [];
      if (seen.indexOf(val) !== -1) {
        throw new Error('circular reference detected while preparing "' + val + '" for query');
      }
      seen.push(val);
      return prepareValue(val.toPostgres(prepareValue), seen);
    }
    return JSON.stringify(val);
  }
  function dateToString(date) {
    let offset = -date.getTimezoneOffset();
    let year = date.getFullYear();
    const isBCYear = year < 1;
    if (isBCYear)
      year = Math.abs(year) + 1;
    let ret = String(year).padStart(4, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0") + "T" + String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0") + "." + String(date.getMilliseconds()).padStart(3, "0");
    if (offset < 0) {
      ret += "-";
      offset *= -1;
    } else {
      ret += "+";
    }
    ret += String(Math.floor(offset / 60)).padStart(2, "0") + ":" + String(offset % 60).padStart(2, "0");
    if (isBCYear)
      ret += " BC";
    return ret;
  }
  function dateToStringUTC(date) {
    let year = date.getUTCFullYear();
    const isBCYear = year < 1;
    if (isBCYear)
      year = Math.abs(year) + 1;
    let ret = String(year).padStart(4, "0") + "-" + String(date.getUTCMonth() + 1).padStart(2, "0") + "-" + String(date.getUTCDate()).padStart(2, "0") + "T" + String(date.getUTCHours()).padStart(2, "0") + ":" + String(date.getUTCMinutes()).padStart(2, "0") + ":" + String(date.getUTCSeconds()).padStart(2, "0") + "." + String(date.getUTCMilliseconds()).padStart(3, "0");
    ret += "+00:00";
    if (isBCYear)
      ret += " BC";
    return ret;
  }
  function normalizeQueryConfig(config, values, callback) {
    config = typeof config === "string" ? { text: config } : config;
    if (values) {
      if (typeof values === "function") {
        config.callback = values;
      } else {
        config.values = values;
      }
    }
    if (callback) {
      config.callback = callback;
    }
    return config;
  }
  var escapeIdentifier = function(str) {
    return '"' + str.replace(/"/g, '""') + '"';
  };
  var escapeLiteral = function(str) {
    let hasBackslash = false;
    let escaped = "'";
    if (str == null) {
      return "''";
    }
    if (typeof str !== "string") {
      return "''";
    }
    for (let i = 0;i < str.length; i++) {
      const c = str[i];
      if (c === "'") {
        escaped += c + c;
      } else if (c === "\\") {
        escaped += c + c;
        hasBackslash = true;
      } else {
        escaped += c;
      }
    }
    escaped += "'";
    if (hasBackslash === true) {
      escaped = " E" + escaped;
    }
    return escaped;
  };
  module.exports = {
    prepareValue: function prepareValueWrapper(value) {
      return prepareValue(value);
    },
    normalizeQueryConfig,
    escapeIdentifier,
    escapeLiteral
  };
});

// node_modules/pg/lib/crypto/utils.js
var require_utils2 = __commonJS(function(exports, module) {
  var nodeCrypto = __require("crypto");
  module.exports = {
    postgresMd5PasswordHash,
    randomBytes,
    deriveKey,
    sha256,
    hashByName,
    hmacSha256,
    md5
  };
  var webCrypto = nodeCrypto.webcrypto || globalThis.crypto;
  var subtleCrypto = webCrypto.subtle;
  var textEncoder = new TextEncoder;
  function randomBytes(length) {
    return webCrypto.getRandomValues(Buffer.alloc(length));
  }
  async function md5(string) {
    try {
      return nodeCrypto.createHash("md5").update(string, "utf-8").digest("hex");
    } catch (e) {
      const data = typeof string === "string" ? textEncoder.encode(string) : string;
      const hash = await subtleCrypto.digest("MD5", data);
      return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  }
  async function postgresMd5PasswordHash(user, password, salt) {
    const inner = await md5(password + user);
    const outer = await md5(Buffer.concat([Buffer.from(inner), salt]));
    return "md5" + outer;
  }
  async function sha256(text) {
    return await subtleCrypto.digest("SHA-256", text);
  }
  async function hashByName(hashName, text) {
    return await subtleCrypto.digest(hashName, text);
  }
  async function hmacSha256(keyBuffer, msg) {
    const key = await subtleCrypto.importKey("raw", keyBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    return await subtleCrypto.sign("HMAC", key, textEncoder.encode(msg));
  }
  async function deriveKey(password, salt, iterations) {
    const key = await subtleCrypto.importKey("raw", textEncoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const params = { name: "PBKDF2", hash: "SHA-256", salt, iterations };
    return await subtleCrypto.deriveBits(params, key, 32 * 8, ["deriveBits"]);
  }
});

// node_modules/pg/lib/crypto/cert-signatures.js
var require_cert_signatures = __commonJS(function(exports, module) {
  function x509Error(msg, cert) {
    return new Error("SASL channel binding: " + msg + " when parsing public certificate " + cert.toString("base64"));
  }
  function readASN1Length(data, index) {
    let length = data[index++];
    if (length < 128)
      return { length, index };
    const lengthBytes = length & 127;
    if (lengthBytes > 4)
      throw x509Error("bad length", data);
    length = 0;
    for (let i = 0;i < lengthBytes; i++) {
      length = length << 8 | data[index++];
    }
    return { length, index };
  }
  function readASN1OID(data, index) {
    if (data[index++] !== 6)
      throw x509Error("non-OID data", data);
    const { length: OIDLength, index: indexAfterOIDLength } = readASN1Length(data, index);
    index = indexAfterOIDLength;
    const lastIndex = index + OIDLength;
    const byte1 = data[index++];
    let oid = (byte1 / 40 >> 0) + "." + byte1 % 40;
    while (index < lastIndex) {
      let value = 0;
      while (index < lastIndex) {
        const nextByte = data[index++];
        value = value << 7 | nextByte & 127;
        if (nextByte < 128)
          break;
      }
      oid += "." + value;
    }
    return { oid, index };
  }
  function expectASN1Seq(data, index) {
    if (data[index++] !== 48)
      throw x509Error("non-sequence data", data);
    return readASN1Length(data, index);
  }
  function signatureAlgorithmHashFromCertificate(data, index) {
    if (index === undefined)
      index = 0;
    index = expectASN1Seq(data, index).index;
    const { length: certInfoLength, index: indexAfterCertInfoLength } = expectASN1Seq(data, index);
    index = indexAfterCertInfoLength + certInfoLength;
    index = expectASN1Seq(data, index).index;
    const { oid, index: indexAfterOID } = readASN1OID(data, index);
    switch (oid) {
      case "1.2.840.113549.1.1.4":
        return "MD5";
      case "1.2.840.113549.1.1.5":
        return "SHA-1";
      case "1.2.840.113549.1.1.11":
        return "SHA-256";
      case "1.2.840.113549.1.1.12":
        return "SHA-384";
      case "1.2.840.113549.1.1.13":
        return "SHA-512";
      case "1.2.840.113549.1.1.14":
        return "SHA-224";
      case "1.2.840.113549.1.1.15":
        return "SHA512-224";
      case "1.2.840.113549.1.1.16":
        return "SHA512-256";
      case "1.2.840.10045.4.1":
        return "SHA-1";
      case "1.2.840.10045.4.3.1":
        return "SHA-224";
      case "1.2.840.10045.4.3.2":
        return "SHA-256";
      case "1.2.840.10045.4.3.3":
        return "SHA-384";
      case "1.2.840.10045.4.3.4":
        return "SHA-512";
      case "1.2.840.113549.1.1.10": {
        index = indexAfterOID;
        index = expectASN1Seq(data, index).index;
        if (data[index++] !== 160)
          throw x509Error("non-tag data", data);
        index = readASN1Length(data, index).index;
        index = expectASN1Seq(data, index).index;
        const { oid: hashOID } = readASN1OID(data, index);
        switch (hashOID) {
          case "1.2.840.113549.2.5":
            return "MD5";
          case "1.3.14.3.2.26":
            return "SHA-1";
          case "2.16.840.1.101.3.4.2.1":
            return "SHA-256";
          case "2.16.840.1.101.3.4.2.2":
            return "SHA-384";
          case "2.16.840.1.101.3.4.2.3":
            return "SHA-512";
        }
        throw x509Error("unknown hash OID " + hashOID, data);
      }
      case "1.3.101.110":
      case "1.3.101.112":
        return "SHA-512";
      case "1.3.101.111":
      case "1.3.101.113":
        throw x509Error("Ed448 certificate channel binding is not currently supported by Postgres");
    }
    throw x509Error("unknown OID " + oid, data);
  }
  module.exports = { signatureAlgorithmHashFromCertificate };
});

// node_modules/pg/lib/crypto/sasl.js
var require_sasl = __commonJS(function(exports, module) {
  var crypto2 = require_utils2();
  var { signatureAlgorithmHashFromCertificate } = require_cert_signatures();
  function saslprep(password) {
    const nonAsciiSpace = /[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g;
    const mappedToNothing = /[\u00AD\u034F\u1806\u180B\u180C\u180D\u200C\u200D\u2060\uFE00-\uFE0F\uFEFF]/g;
    return password.replace(nonAsciiSpace, " ").replace(mappedToNothing, "").normalize("NFKC");
  }
  var DEFAULT_MAX_SCRAM_ITERATIONS = 1e5;
  function startSession(mechanisms, stream, scramMaxIterations = DEFAULT_MAX_SCRAM_ITERATIONS) {
    const candidates = ["SCRAM-SHA-256"];
    if (stream)
      candidates.unshift("SCRAM-SHA-256-PLUS");
    const mechanism = candidates.find((candidate) => mechanisms.includes(candidate));
    if (!mechanism) {
      throw new Error("SASL: Only mechanism(s) " + candidates.join(" and ") + " are supported");
    }
    if (mechanism === "SCRAM-SHA-256-PLUS" && typeof stream.getPeerCertificate !== "function") {
      throw new Error("SASL: Mechanism SCRAM-SHA-256-PLUS requires a certificate");
    }
    const clientNonce = crypto2.randomBytes(18).toString("base64");
    const gs2Header = mechanism === "SCRAM-SHA-256-PLUS" ? "p=tls-server-end-point" : stream ? "y" : "n";
    return {
      mechanism,
      clientNonce,
      response: gs2Header + ",,n=*,r=" + clientNonce,
      message: "SASLInitialResponse",
      scramMaxIterations
    };
  }
  async function continueSession(session, password, serverData, stream) {
    if (session.message !== "SASLInitialResponse") {
      throw new Error("SASL: Last message was not SASLInitialResponse");
    }
    if (typeof password !== "string") {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");
    }
    if (password === "") {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string");
    }
    if (typeof serverData !== "string") {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
    }
    const sv = parseServerFirstMessage(serverData);
    if (!sv.nonce.startsWith(session.clientNonce)) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
    } else if (sv.nonce.length === session.clientNonce.length) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    }
    const scramMaxIterations = typeof session.scramMaxIterations === "number" ? session.scramMaxIterations : DEFAULT_MAX_SCRAM_ITERATIONS;
    if (scramMaxIterations !== 0 && sv.iteration > scramMaxIterations) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration count " + sv.iteration + " exceeds scramMaxIterations of " + scramMaxIterations);
    }
    const clientFirstMessageBare = "n=*,r=" + session.clientNonce;
    const serverFirstMessage = "r=" + sv.nonce + ",s=" + sv.salt + ",i=" + sv.iteration;
    let channelBinding = stream ? "eSws" : "biws";
    if (session.mechanism === "SCRAM-SHA-256-PLUS") {
      const peerCert = stream.getPeerCertificate().raw;
      let hashName = signatureAlgorithmHashFromCertificate(peerCert);
      if (hashName === "MD5" || hashName === "SHA-1")
        hashName = "SHA-256";
      const certHash = await crypto2.hashByName(hashName, peerCert);
      const bindingData = Buffer.concat([Buffer.from("p=tls-server-end-point,,"), Buffer.from(certHash)]);
      channelBinding = bindingData.toString("base64");
    }
    const clientFinalMessageWithoutProof = "c=" + channelBinding + ",r=" + sv.nonce;
    const authMessage = clientFirstMessageBare + "," + serverFirstMessage + "," + clientFinalMessageWithoutProof;
    const saltBytes = Buffer.from(sv.salt, "base64");
    const saltedPassword = await crypto2.deriveKey(saslprep(password), saltBytes, sv.iteration);
    const clientKey = await crypto2.hmacSha256(saltedPassword, "Client Key");
    const storedKey = await crypto2.sha256(clientKey);
    const clientSignature = await crypto2.hmacSha256(storedKey, authMessage);
    const clientProof = xorBuffers(Buffer.from(clientKey), Buffer.from(clientSignature)).toString("base64");
    const serverKey = await crypto2.hmacSha256(saltedPassword, "Server Key");
    const serverSignatureBytes = await crypto2.hmacSha256(serverKey, authMessage);
    session.message = "SASLResponse";
    session.serverSignature = Buffer.from(serverSignatureBytes).toString("base64");
    session.response = clientFinalMessageWithoutProof + ",p=" + clientProof;
  }
  function finalizeSession(session, serverData) {
    if (session.message !== "SASLResponse") {
      throw new Error("SASL: Last message was not SASLResponse");
    }
    if (typeof serverData !== "string") {
      throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
    }
    const { serverSignature } = parseServerFinalMessage(serverData);
    if (serverSignature !== session.serverSignature) {
      throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
    }
  }
  function isPrintableChars(text) {
    if (typeof text !== "string") {
      throw new TypeError("SASL: text must be a string");
    }
    return text.split("").map((_, i) => text.charCodeAt(i)).every((c) => c >= 33 && c <= 43 || c >= 45 && c <= 126);
  }
  function isBase64(text) {
    return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(text);
  }
  function parseAttributePairs(text) {
    if (typeof text !== "string") {
      throw new TypeError("SASL: attribute pairs text must be a string");
    }
    return new Map(text.split(",").map((attrValue) => {
      if (!/^.=/.test(attrValue)) {
        throw new Error("SASL: Invalid attribute pair entry");
      }
      const name = attrValue[0];
      const value = attrValue.substring(2);
      return [name, value];
    }));
  }
  function parseServerFirstMessage(data) {
    const attrPairs = parseAttributePairs(data);
    const nonce = attrPairs.get("r");
    if (!nonce) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
    } else if (!isPrintableChars(nonce)) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
    }
    const salt = attrPairs.get("s");
    if (!salt) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
    } else if (!isBase64(salt)) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64");
    }
    const iterationText = attrPairs.get("i");
    if (!iterationText) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
    } else if (!/^[1-9][0-9]*$/.test(iterationText)) {
      throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
    }
    const iteration = parseInt(iterationText, 10);
    return {
      nonce,
      salt,
      iteration
    };
  }
  function parseServerFinalMessage(serverData) {
    const attrPairs = parseAttributePairs(serverData);
    const error = attrPairs.get("e");
    const serverSignature = attrPairs.get("v");
    if (error) {
      throw new Error(`SASL: SCRAM-SERVER-FINAL-MESSAGE: server returned error: "${error}"`);
    }
    if (!serverSignature) {
      throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");
    } else if (!isBase64(serverSignature)) {
      throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
    }
    return {
      serverSignature
    };
  }
  function xorBuffers(a, b) {
    if (!Buffer.isBuffer(a)) {
      throw new TypeError("first argument must be a Buffer");
    }
    if (!Buffer.isBuffer(b)) {
      throw new TypeError("second argument must be a Buffer");
    }
    if (a.length !== b.length) {
      throw new Error("Buffer lengths must match");
    }
    if (a.length === 0) {
      throw new Error("Buffers cannot be empty");
    }
    return Buffer.from(a.map((_, i) => a[i] ^ b[i]));
  }
  module.exports = {
    startSession,
    continueSession,
    finalizeSession,
    DEFAULT_MAX_SCRAM_ITERATIONS
  };
});

// node_modules/pg/lib/type-overrides.js
var require_type_overrides = __commonJS(function(exports, module) {
  var types = require_pg_types();
  function TypeOverrides(userTypes) {
    this._types = userTypes || types;
    this.text = {};
    this.binary = {};
  }
  TypeOverrides.prototype.getOverrides = function(format) {
    switch (format) {
      case "text":
        return this.text;
      case "binary":
        return this.binary;
      default:
        return {};
    }
  };
  TypeOverrides.prototype.setTypeParser = function(oid, format, parseFn) {
    if (typeof format === "function") {
      parseFn = format;
      format = "text";
    }
    this.getOverrides(format)[oid] = parseFn;
  };
  TypeOverrides.prototype.getTypeParser = function(oid, format) {
    format = format || "text";
    return this.getOverrides(format)[oid] || this._types.getTypeParser(oid, format);
  };
  module.exports = TypeOverrides;
});

// node_modules/pg-connection-string/index.js
var require_pg_connection_string = __commonJS(function(exports, module) {
  function parse(str, options = {}) {
    if (str.charAt(0) === "/") {
      const config = str.split(" ");
      return { host: config[0], database: config[1] };
    }
    const config = Object.create(null);
    let result;
    let dummyHost = false;
    if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) {
      str = encodeURI(str).replace(/%25(\d\d)/g, "%$1");
    }
    try {
      try {
        result = new URL(str, "postgres://base");
      } catch (e) {
        result = new URL(str.replace("@/", "@___DUMMY___/"), "postgres://base");
        dummyHost = true;
      }
    } catch (err) {
      err.input && (err.input = "*****REDACTED*****");
      throw err;
    }
    for (const entry of result.searchParams.entries()) {
      config[entry[0]] = entry[1];
    }
    config.user = config.user || decodeURIComponent(result.username);
    config.password = config.password || decodeURIComponent(result.password);
    if (result.protocol == "socket:") {
      config.host = decodeURI(result.pathname);
      config.database = result.searchParams.get("db");
      config.client_encoding = result.searchParams.get("encoding");
      return config;
    }
    const hostname = dummyHost ? "" : result.hostname;
    if (!config.host) {
      config.host = decodeURIComponent(hostname);
    } else if (hostname && /^%2f/i.test(hostname)) {
      result.pathname = hostname + result.pathname;
    }
    if (!config.port) {
      config.port = result.port;
    }
    const pathname = result.pathname.slice(1) || null;
    config.database = pathname ? decodeURI(pathname) : null;
    if (config.ssl === "true" || config.ssl === "1") {
      config.ssl = true;
    }
    if (config.ssl === "0") {
      config.ssl = false;
    }
    if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) {
      config.ssl = {};
    }
    if (config.sslnegotiation === "direct" && config.ssl === undefined) {
      config.ssl = true;
    }
    const fs = config.sslcert || config.sslkey || config.sslrootcert ? __require("fs") : null;
    if (config.sslcert) {
      config.ssl.cert = fs.readFileSync(config.sslcert).toString();
    }
    if (config.sslkey) {
      config.ssl.key = fs.readFileSync(config.sslkey).toString();
    }
    if (config.sslrootcert) {
      config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
    }
    if (options.useLibpqCompat && config.uselibpqcompat) {
      throw new Error("Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.");
    }
    if (config.uselibpqcompat === "true" || options.useLibpqCompat) {
      switch (config.sslmode) {
        case "disable": {
          config.ssl = false;
          break;
        }
        case "prefer": {
          config.ssl.rejectUnauthorized = false;
          break;
        }
        case "require": {
          if (config.sslrootcert) {
            config.ssl.checkServerIdentity = function() {};
          } else {
            config.ssl.rejectUnauthorized = false;
          }
          break;
        }
        case "verify-ca": {
          if (!config.ssl.ca) {
            throw new Error("SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.");
          }
          config.ssl.checkServerIdentity = function() {};
          break;
        }
        case "verify-full": {
          break;
        }
      }
    } else {
      switch (config.sslmode) {
        case "disable": {
          config.ssl = false;
          break;
        }
        case "prefer":
        case "require":
        case "verify-ca":
        case "verify-full": {
          if (config.sslmode !== "verify-full") {
            deprecatedSslModeWarning(config.sslmode);
          }
          break;
        }
        case "no-verify": {
          config.ssl.rejectUnauthorized = false;
          break;
        }
      }
    }
    return config;
  }
  function toConnectionOptions(sslConfig) {
    const connectionOptions = Object.entries(sslConfig).reduce((c, [key, value]) => {
      if (value !== undefined && value !== null) {
        c[key] = value;
      }
      return c;
    }, Object.create(null));
    return connectionOptions;
  }
  function toClientConfig(config) {
    const poolConfig = Object.entries(config).reduce((c, [key, value]) => {
      if (key === "ssl") {
        const sslConfig = value;
        if (typeof sslConfig === "boolean") {
          c[key] = sslConfig;
        }
        if (typeof sslConfig === "object") {
          c[key] = toConnectionOptions(sslConfig);
        }
      } else if (value !== undefined && value !== null) {
        if (key === "port") {
          if (value !== "") {
            const v = parseInt(value, 10);
            if (isNaN(v)) {
              throw new Error(`Invalid ${key}: ${value}`);
            }
            c[key] = v;
          }
        } else {
          c[key] = value;
        }
      }
      return c;
    }, Object.create(null));
    return poolConfig;
  }
  function parseIntoClientConfig(str) {
    return toClientConfig(parse(str));
  }
  function deprecatedSslModeWarning(sslmode) {
    if (!deprecatedSslModeWarning.warned && typeof process !== "undefined" && process.emitWarning) {
      deprecatedSslModeWarning.warned = true;
      process.emitWarning(`SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=${sslmode}'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.`);
    }
  }
  module.exports = parse;
  parse.parse = parse;
  parse.toClientConfig = toClientConfig;
  parse.parseIntoClientConfig = parseIntoClientConfig;
});

// node_modules/pg/lib/connection-parameters.js
var require_connection_parameters = __commonJS(function(exports, module) {
  var dns = __require("dns");
  var defaults = require_defaults();
  var parse = require_pg_connection_string().parse;
  var val = function(key, config, envVar) {
    if (config[key]) {
      return config[key];
    }
    if (envVar === undefined) {
      envVar = process.env["PG" + key.toUpperCase()];
    } else if (envVar === false) {} else {
      envVar = process.env[envVar];
    }
    return envVar || defaults[key];
  };
  var readSSLConfigFromEnvironment = function() {
    switch (process.env.PGSSLMODE) {
      case "disable":
        return false;
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        return true;
      case "no-verify":
        return { rejectUnauthorized: false };
    }
    return defaults.ssl;
  };
  var quoteParamValue = function(value) {
    return "'" + ("" + value).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
  };
  var add = function(params, config, paramName) {
    const value = config[paramName];
    if (value !== undefined && value !== null) {
      params.push(paramName + "=" + quoteParamValue(value));
    }
  };

  class ConnectionParameters {
    constructor(config) {
      config = typeof config === "string" ? parse(config) : config || {};
      if (config.connectionString) {
        config = Object.assign({}, config, parse(config.connectionString));
      }
      this.user = val("user", config);
      this.database = val("database", config);
      if (this.database === undefined) {
        this.database = this.user;
      }
      this.port = parseInt(val("port", config), 10);
      this.host = val("host", config);
      Object.defineProperty(this, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: val("password", config)
      });
      this.binary = val("binary", config);
      this.options = val("options", config);
      this.ssl = typeof config.ssl === "undefined" ? readSSLConfigFromEnvironment() : config.ssl;
      if (typeof this.ssl === "string") {
        if (this.ssl === "true") {
          this.ssl = true;
        }
      }
      if (this.ssl === "no-verify") {
        this.ssl = { rejectUnauthorized: false };
      }
      if (this.ssl && this.ssl.key) {
        Object.defineProperty(this.ssl, "key", {
          enumerable: false
        });
      }
      this.sslnegotiation = val("sslnegotiation", config, "PGSSLNEGOTIATION");
      if (this.sslnegotiation !== undefined && this.sslnegotiation !== "postgres" && this.sslnegotiation !== "direct") {
        throw new Error(`Invalid sslnegotiation value: "${this.sslnegotiation}". Valid values are "postgres" and "direct".`);
      }
      if (this.sslnegotiation === "direct" && !this.ssl) {
        throw new Error("sslnegotiation=direct requires SSL to be enabled");
      }
      this.client_encoding = val("client_encoding", config);
      this.replication = val("replication", config);
      this.isDomainSocket = !(this.host || "").indexOf("/");
      this.application_name = val("application_name", config, "PGAPPNAME");
      this.fallback_application_name = val("fallback_application_name", config, false);
      this.statement_timeout = val("statement_timeout", config, false);
      this.lock_timeout = val("lock_timeout", config, false);
      this.idle_in_transaction_session_timeout = val("idle_in_transaction_session_timeout", config, false);
      this.query_timeout = val("query_timeout", config, false);
      if (config.connectionTimeoutMillis === undefined) {
        this.connect_timeout = process.env.PGCONNECT_TIMEOUT || 0;
      } else {
        this.connect_timeout = Math.floor(config.connectionTimeoutMillis / 1000);
      }
      if (config.keepAlive === false) {
        this.keepalives = 0;
      } else if (config.keepAlive === true) {
        this.keepalives = 1;
      }
      if (typeof config.keepAliveInitialDelayMillis === "number") {
        this.keepalives_idle = Math.floor(config.keepAliveInitialDelayMillis / 1000);
      }
    }
    getLibpqConnectionString(cb) {
      const params = [];
      add(params, this, "user");
      add(params, this, "password");
      add(params, this, "port");
      add(params, this, "application_name");
      add(params, this, "fallback_application_name");
      add(params, this, "connect_timeout");
      add(params, this, "options");
      const ssl = typeof this.ssl === "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
      add(params, ssl, "sslmode");
      add(params, ssl, "sslca");
      add(params, ssl, "sslkey");
      add(params, ssl, "sslcert");
      add(params, ssl, "sslrootcert");
      add(params, this, "sslnegotiation");
      if (this.database) {
        params.push("dbname=" + quoteParamValue(this.database));
      }
      if (this.replication) {
        params.push("replication=" + quoteParamValue(this.replication));
      }
      if (this.host) {
        params.push("host=" + quoteParamValue(this.host));
      }
      if (this.isDomainSocket) {
        return cb(null, params.join(" "));
      }
      if (this.client_encoding) {
        params.push("client_encoding=" + quoteParamValue(this.client_encoding));
      }
      dns.lookup(this.host, function(err, address) {
        if (err)
          return cb(err, null);
        params.push("hostaddr=" + quoteParamValue(address));
        return cb(null, params.join(" "));
      });
    }
  }
  module.exports = ConnectionParameters;
});

// node_modules/pg/lib/result.js
var require_result = __commonJS(function(exports, module) {
  var types = require_pg_types();
  var matchRegexp = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;

  class Result {
    constructor(rowMode, types) {
      this.command = null;
      this.rowCount = null;
      this.oid = null;
      this.rows = [];
      this.fields = [];
      this._parsers = undefined;
      this._types = types;
      this.RowCtor = null;
      this.rowAsArray = rowMode === "array";
      if (this.rowAsArray) {
        this.parseRow = this._parseRowAsArray;
      }
      this._prebuiltEmptyResultObject = null;
    }
    addCommandComplete(msg) {
      let match;
      if (msg.text) {
        match = matchRegexp.exec(msg.text);
      } else {
        match = matchRegexp.exec(msg.command);
      }
      if (match) {
        this.command = match[1];
        if (match[3]) {
          this.oid = parseInt(match[2], 10);
          this.rowCount = parseInt(match[3], 10);
        } else if (match[2]) {
          this.rowCount = parseInt(match[2], 10);
        }
      }
    }
    _parseRowAsArray(rowData) {
      const row = new Array(rowData.length);
      for (let i = 0, len = rowData.length;i < len; i++) {
        const rawValue = rowData[i];
        if (rawValue !== null) {
          row[i] = this._parsers[i](rawValue);
        } else {
          row[i] = null;
        }
      }
      return row;
    }
    parseRow(rowData) {
      const row = { ...this._prebuiltEmptyResultObject };
      for (let i = 0, len = rowData.length;i < len; i++) {
        const rawValue = rowData[i];
        const field = this.fields[i].name;
        if (rawValue !== null) {
          const v = this.fields[i].format === "binary" ? Buffer.from(rawValue) : rawValue;
          row[field] = this._parsers[i](v);
        } else {
          row[field] = null;
        }
      }
      return row;
    }
    addRow(row) {
      this.rows.push(row);
    }
    addFields(fieldDescriptions) {
      this.fields = fieldDescriptions;
      if (this.fields.length) {
        this._parsers = new Array(fieldDescriptions.length);
      }
      const row = Object.create(null);
      for (let i = 0;i < fieldDescriptions.length; i++) {
        const desc = fieldDescriptions[i];
        row[desc.name] = null;
        if (this._types) {
          this._parsers[i] = this._types.getTypeParser(desc.dataTypeID, desc.format || "text");
        } else {
          this._parsers[i] = types.getTypeParser(desc.dataTypeID, desc.format || "text");
        }
      }
      this._prebuiltEmptyResultObject = { ...row };
    }
  }
  module.exports = Result;
});

// node_modules/pg/lib/query.js
var require_query = __commonJS(function(exports, module) {
  var { EventEmitter } = __require("events");
  var Result = require_result();
  var utils = require_utils();

  class Query extends EventEmitter {
    constructor(config, values, callback) {
      super();
      config = utils.normalizeQueryConfig(config, values, callback);
      this.text = config.text;
      this.values = config.values;
      this.rows = config.rows;
      this.types = config.types;
      this.name = config.name;
      this.queryMode = config.queryMode;
      this.binary = config.binary;
      this.portal = config.portal || "";
      this.callback = config.callback;
      this._rowMode = config.rowMode;
      if (process.domain && config.callback) {
        this.callback = process.domain.bind(config.callback);
      }
      this._result = new Result(this._rowMode, this.types);
      this._results = this._result;
      this._canceledDueToError = false;
    }
    requiresPreparation() {
      if (this.queryMode === "extended") {
        return true;
      }
      if (this.name) {
        return true;
      }
      if (this.rows) {
        return true;
      }
      if (!this.text) {
        return false;
      }
      if (!this.values) {
        return false;
      }
      return this.values.length > 0;
    }
    _checkForMultirow() {
      if (this._result.command) {
        if (!Array.isArray(this._results)) {
          this._results = [this._result];
        }
        this._result = new Result(this._rowMode, this._result._types);
        this._results.push(this._result);
      }
    }
    handleRowDescription(msg) {
      this._checkForMultirow();
      this._result.addFields(msg.fields);
      this._accumulateRows = this.callback || !this.listeners("row").length;
    }
    handleDataRow(msg) {
      let row;
      if (this._canceledDueToError) {
        return;
      }
      try {
        row = this._result.parseRow(msg.fields);
      } catch (err) {
        this._canceledDueToError = err;
        return;
      }
      this.emit("row", row, this._result);
      if (this._accumulateRows) {
        this._result.addRow(row);
      }
    }
    handleCommandComplete(msg, connection) {
      this._checkForMultirow();
      this._result.addCommandComplete(msg);
      if (this.rows) {
        connection.sync();
      }
    }
    handleEmptyQuery(connection) {
      if (this.rows) {
        connection.sync();
      }
    }
    handleError(err, connection) {
      if (this._canceledDueToError) {
        err = this._canceledDueToError;
        this._canceledDueToError = false;
      }
      if (this.callback) {
        return this.callback(err);
      }
      this.emit("error", err);
    }
    handleReadyForQuery(con) {
      if (this._canceledDueToError) {
        return this.handleError(this._canceledDueToError, con);
      }
      if (this.callback) {
        try {
          this.callback(null, this._results);
        } catch (err) {
          process.nextTick(() => {
            throw err;
          });
        }
      }
      this.emit("end", this._results);
    }
    submit(connection) {
      if (typeof this.text !== "string" && typeof this.name !== "string") {
        return new Error("A query must have either text or a name. Supplying neither is unsupported.");
      }
      const previous = connection.parsedStatements[this.name] || connection.submittedNamedStatements[this.name];
      if (this.text && previous && this.text !== previous) {
        return new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
      }
      if (this.values && !Array.isArray(this.values)) {
        return new Error("Query values must be an array");
      }
      if (this.requiresPreparation()) {
        connection.stream.cork && connection.stream.cork();
        try {
          this.prepare(connection);
        } finally {
          connection.stream.uncork && connection.stream.uncork();
        }
      } else {
        connection.query(this.text);
      }
      return null;
    }
    hasBeenParsed(connection) {
      return this.name && (connection.parsedStatements[this.name] || connection.submittedNamedStatements[this.name]);
    }
    handlePortalSuspended(connection) {
      this._getRows(connection, this.rows);
    }
    _getRows(connection, rows) {
      connection.execute({
        portal: this.portal,
        rows
      });
      if (!rows) {
        connection.sync();
      } else {
        connection.flush();
      }
    }
    prepare(connection) {
      if (!this.hasBeenParsed(connection)) {
        connection.parse({
          text: this.text,
          name: this.name,
          types: this.types
        });
        if (this.name) {
          connection.submittedNamedStatements[this.name] = this.text;
        }
      }
      try {
        connection.bind({
          portal: this.portal,
          statement: this.name,
          values: this.values,
          binary: this.binary,
          valueMapper: utils.prepareValue
        });
      } catch (err) {
        connection.close({ type: "S", name: this.name });
        connection.sync();
        this.handleError(err, connection);
        return;
      }
      connection.describe({
        type: "P",
        name: this.portal || ""
      });
      this._getRows(connection, this.rows);
    }
    handleCopyInResponse(connection) {
      connection.sendCopyFail("No source stream defined");
    }
    handleCopyData(msg, connection) {}
  }
  module.exports = Query;
});

// node_modules/pg-protocol/dist/messages.js
var require_messages = __commonJS(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.NoticeMessage = exports.DataRowMessage = exports.CommandCompleteMessage = exports.ReadyForQueryMessage = exports.NotificationResponseMessage = exports.BackendKeyDataMessage = exports.AuthenticationMD5Password = exports.ParameterStatusMessage = exports.ParameterDescriptionMessage = exports.RowDescriptionMessage = exports.Field = exports.CopyResponse = exports.CopyDataMessage = exports.DatabaseError = exports.copyDone = exports.emptyQuery = exports.replicationStart = exports.portalSuspended = exports.noData = exports.closeComplete = exports.bindComplete = exports.parseComplete = undefined;
  exports.parseComplete = {
    name: "parseComplete",
    length: 5
  };
  exports.bindComplete = {
    name: "bindComplete",
    length: 5
  };
  exports.closeComplete = {
    name: "closeComplete",
    length: 5
  };
  exports.noData = {
    name: "noData",
    length: 5
  };
  exports.portalSuspended = {
    name: "portalSuspended",
    length: 5
  };
  exports.replicationStart = {
    name: "replicationStart",
    length: 4
  };
  exports.emptyQuery = {
    name: "emptyQuery",
    length: 4
  };
  exports.copyDone = {
    name: "copyDone",
    length: 4
  };

  class DatabaseError extends Error {
    constructor(message, length, name) {
      super(message);
      this.length = length;
      this.name = name;
    }
  }
  exports.DatabaseError = DatabaseError;

  class CopyDataMessage {
    constructor(length, chunk) {
      this.length = length;
      this.chunk = chunk;
      this.name = "copyData";
    }
  }
  exports.CopyDataMessage = CopyDataMessage;

  class CopyResponse {
    constructor(length, name, binary, columnCount) {
      this.length = length;
      this.name = name;
      this.binary = binary;
      this.columnTypes = new Array(columnCount);
    }
  }
  exports.CopyResponse = CopyResponse;

  class Field {
    constructor(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, format) {
      this.name = name;
      this.tableID = tableID;
      this.columnID = columnID;
      this.dataTypeID = dataTypeID;
      this.dataTypeSize = dataTypeSize;
      this.dataTypeModifier = dataTypeModifier;
      this.format = format;
    }
  }
  exports.Field = Field;

  class RowDescriptionMessage {
    constructor(length, fieldCount) {
      this.length = length;
      this.fieldCount = fieldCount;
      this.name = "rowDescription";
      this.fields = new Array(this.fieldCount);
    }
  }
  exports.RowDescriptionMessage = RowDescriptionMessage;

  class ParameterDescriptionMessage {
    constructor(length, parameterCount) {
      this.length = length;
      this.parameterCount = parameterCount;
      this.name = "parameterDescription";
      this.dataTypeIDs = new Array(this.parameterCount);
    }
  }
  exports.ParameterDescriptionMessage = ParameterDescriptionMessage;

  class ParameterStatusMessage {
    constructor(length, parameterName, parameterValue) {
      this.length = length;
      this.parameterName = parameterName;
      this.parameterValue = parameterValue;
      this.name = "parameterStatus";
    }
  }
  exports.ParameterStatusMessage = ParameterStatusMessage;

  class AuthenticationMD5Password {
    constructor(length, salt) {
      this.length = length;
      this.salt = salt;
      this.name = "authenticationMD5Password";
    }
  }
  exports.AuthenticationMD5Password = AuthenticationMD5Password;

  class BackendKeyDataMessage {
    constructor(length, processID, secretKey) {
      this.length = length;
      this.processID = processID;
      this.secretKey = secretKey;
      this.name = "backendKeyData";
    }
  }
  exports.BackendKeyDataMessage = BackendKeyDataMessage;

  class NotificationResponseMessage {
    constructor(length, processId, channel, payload) {
      this.length = length;
      this.processId = processId;
      this.channel = channel;
      this.payload = payload;
      this.name = "notification";
    }
  }
  exports.NotificationResponseMessage = NotificationResponseMessage;

  class ReadyForQueryMessage {
    constructor(length, status) {
      this.length = length;
      this.status = status;
      this.name = "readyForQuery";
    }
  }
  exports.ReadyForQueryMessage = ReadyForQueryMessage;

  class CommandCompleteMessage {
    constructor(length, text) {
      this.length = length;
      this.text = text;
      this.name = "commandComplete";
    }
  }
  exports.CommandCompleteMessage = CommandCompleteMessage;

  class DataRowMessage {
    constructor(length, fields) {
      this.length = length;
      this.fields = fields;
      this.name = "dataRow";
      this.fieldCount = fields.length;
    }
  }
  exports.DataRowMessage = DataRowMessage;

  class NoticeMessage {
    constructor(length, message) {
      this.length = length;
      this.message = message;
      this.name = "notice";
    }
  }
  exports.NoticeMessage = NoticeMessage;
});

// node_modules/pg-protocol/dist/buffer-writer.js
var require_buffer_writer = __commonJS(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Writer = undefined;

  class Writer {
    constructor(size = 256) {
      this.size = size;
      this.offset = 5;
      this.headerPosition = 0;
      this.buffer = Buffer.allocUnsafe(size);
    }
    ensure(size) {
      const remaining = this.buffer.length - this.offset;
      if (remaining < size) {
        const oldBuffer = this.buffer;
        const newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
        this.buffer = Buffer.allocUnsafe(newSize);
        oldBuffer.copy(this.buffer);
      }
    }
    addInt32(num) {
      this.ensure(4);
      this.buffer[this.offset++] = num >>> 24 & 255;
      this.buffer[this.offset++] = num >>> 16 & 255;
      this.buffer[this.offset++] = num >>> 8 & 255;
      this.buffer[this.offset++] = num >>> 0 & 255;
      return this;
    }
    addInt16(num) {
      this.ensure(2);
      this.buffer[this.offset++] = num >>> 8 & 255;
      this.buffer[this.offset++] = num >>> 0 & 255;
      return this;
    }
    addCString(string) {
      if (!string) {
        this.ensure(1);
      } else {
        const len = Buffer.byteLength(string);
        this.ensure(len + 1);
        this.buffer.write(string, this.offset, "utf-8");
        this.offset += len;
      }
      this.buffer[this.offset++] = 0;
      return this;
    }
    addString(string = "") {
      const len = Buffer.byteLength(string);
      this.ensure(len);
      this.buffer.write(string, this.offset);
      this.offset += len;
      return this;
    }
    addInt32PrefixedString(string) {
      const len = Buffer.byteLength(string);
      this.ensure(4 + len);
      const buffer = this.buffer;
      let offset = this.offset;
      buffer[offset++] = len >>> 24 & 255;
      buffer[offset++] = len >>> 16 & 255;
      buffer[offset++] = len >>> 8 & 255;
      buffer[offset++] = len >>> 0 & 255;
      buffer.write(string, offset, "utf-8");
      this.offset = offset + len;
      return this;
    }
    add(otherBuffer) {
      this.ensure(otherBuffer.length);
      otherBuffer.copy(this.buffer, this.offset);
      this.offset += otherBuffer.length;
      return this;
    }
    join(code) {
      if (code) {
        this.buffer[this.headerPosition] = code;
        const length = this.offset - (this.headerPosition + 1);
        this.buffer.writeInt32BE(length, this.headerPosition + 1);
      }
      return this.buffer.slice(code ? 0 : 5, this.offset);
    }
    flush(code) {
      const result = this.join(code);
      this.offset = 5;
      this.headerPosition = 0;
      this.buffer = Buffer.allocUnsafe(this.size);
      return result;
    }
    clear() {
      this.offset = 5;
      this.headerPosition = 0;
    }
  }
  exports.Writer = Writer;
});

// node_modules/pg-protocol/dist/serializer.js
var require_serializer = __commonJS(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.serialize = undefined;
  var buffer_writer_1 = require_buffer_writer();
  var writer = new buffer_writer_1.Writer;
  var startup = (opts) => {
    writer.addInt16(3).addInt16(0);
    for (const key of Object.keys(opts)) {
      writer.addCString(key).addCString(opts[key]);
    }
    writer.addCString("client_encoding").addCString("UTF8");
    const bodyBuffer = writer.addCString("").flush();
    const length = bodyBuffer.length + 4;
    return new buffer_writer_1.Writer().addInt32(length).add(bodyBuffer).flush();
  };
  var requestSsl = () => {
    const response = Buffer.allocUnsafe(8);
    response.writeInt32BE(8, 0);
    response.writeInt32BE(80877103, 4);
    return response;
  };
  var password = (password) => {
    return writer.addCString(password).flush(112);
  };
  var sendSASLInitialResponseMessage = function(mechanism, initialResponse) {
    writer.addCString(mechanism).addInt32PrefixedString(initialResponse);
    return writer.flush(112);
  };
  var sendSCRAMClientFinalMessage = function(additionalData) {
    return writer.addString(additionalData).flush(112);
  };
  var query = (text) => {
    return writer.addCString(text).flush(81);
  };
  var emptyArray = [];
  var parse = (query) => {
    const name = query.name || "";
    if (name.length > 63) {
      console.error("Warning! Postgres only supports 63 characters for query names.");
      console.error("You supplied %s (%s)", name, name.length);
      console.error("This can cause conflicts and silent errors executing queries");
    }
    const types = query.types || emptyArray;
    const len = types.length;
    const buffer = writer.addCString(name).addCString(query.text).addInt16(len);
    for (let i = 0;i < len; i++) {
      buffer.addInt32(types[i]);
    }
    return writer.flush(80);
  };
  var paramWriter = new buffer_writer_1.Writer;
  var writeValues = function(values, valueMapper) {
    for (let i = 0;i < values.length; i++) {
      const mappedVal = valueMapper ? valueMapper(values[i], i) : values[i];
      if (mappedVal == null) {
        writer.addInt16(0);
        paramWriter.addInt32(-1);
      } else if (mappedVal instanceof Buffer) {
        writer.addInt16(1);
        paramWriter.addInt32(mappedVal.length);
        paramWriter.add(mappedVal);
      } else {
        writer.addInt16(0);
        paramWriter.addInt32PrefixedString(mappedVal);
      }
    }
  };
  var bind = (config = {}) => {
    const portal = config.portal || "";
    const statement = config.statement || "";
    const binary = config.binary || false;
    const values = config.values || emptyArray;
    const len = values.length;
    writer.addCString(portal).addCString(statement);
    writer.addInt16(len);
    try {
      writeValues(values, config.valueMapper);
    } catch (err) {
      writer.clear();
      paramWriter.clear();
      throw err;
    }
    writer.addInt16(len);
    writer.add(paramWriter.flush());
    writer.addInt16(1);
    writer.addInt16(binary ? 1 : 0);
    return writer.flush(66);
  };
  var emptyExecute = Buffer.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]);
  var execute = (config) => {
    if (!config || !config.portal && !config.rows) {
      return emptyExecute;
    }
    const portal = config.portal || "";
    const rows = config.rows || 0;
    const portalLength = Buffer.byteLength(portal);
    const len = 4 + portalLength + 1 + 4;
    const buff = Buffer.allocUnsafe(1 + len);
    buff[0] = 69;
    buff.writeInt32BE(len, 1);
    buff.write(portal, 5, "utf-8");
    buff[portalLength + 5] = 0;
    buff.writeUInt32BE(rows, buff.length - 4);
    return buff;
  };
  var cancel = (processID, secretKey) => {
    const buffer = Buffer.allocUnsafe(16);
    buffer.writeInt32BE(16, 0);
    buffer.writeInt16BE(1234, 4);
    buffer.writeInt16BE(5678, 6);
    buffer.writeInt32BE(processID, 8);
    buffer.writeInt32BE(secretKey, 12);
    return buffer;
  };
  var cstringMessage = (code, string) => {
    const stringLen = Buffer.byteLength(string);
    const len = 4 + stringLen + 1;
    const buffer = Buffer.allocUnsafe(1 + len);
    buffer[0] = code;
    buffer.writeInt32BE(len, 1);
    buffer.write(string, 5, "utf-8");
    buffer[len] = 0;
    return buffer;
  };
  var emptyDescribePortal = writer.addCString("P").flush(68);
  var emptyDescribeStatement = writer.addCString("S").flush(68);
  var describe = (msg) => {
    return msg.name ? cstringMessage(68, `${msg.type}${msg.name || ""}`) : msg.type === "P" ? emptyDescribePortal : emptyDescribeStatement;
  };
  var close = (msg) => {
    const text = `${msg.type}${msg.name || ""}`;
    return cstringMessage(67, text);
  };
  var copyData = (chunk) => {
    return writer.add(chunk).flush(100);
  };
  var copyFail = (message) => {
    return cstringMessage(102, message);
  };
  var codeOnlyBuffer = (code) => Buffer.from([code, 0, 0, 0, 4]);
  var flushBuffer = codeOnlyBuffer(72);
  var syncBuffer = codeOnlyBuffer(83);
  var endBuffer = codeOnlyBuffer(88);
  var copyDoneBuffer = codeOnlyBuffer(99);
  var serialize = {
    startup,
    password,
    requestSsl,
    sendSASLInitialResponseMessage,
    sendSCRAMClientFinalMessage,
    query,
    parse,
    bind,
    execute,
    describe,
    close,
    flush: () => flushBuffer,
    sync: () => syncBuffer,
    end: () => endBuffer,
    copyData,
    copyDone: () => copyDoneBuffer,
    copyFail,
    cancel
  };
  exports.serialize = serialize;
});

// node_modules/pg-protocol/dist/buffer-reader.js
var require_buffer_reader = __commonJS(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.BufferReader = undefined;

  class BufferReader {
    constructor(offset = 0) {
      this.offset = offset;
      this.buffer = Buffer.allocUnsafe(0);
      this.encoding = "utf-8";
    }
    setBuffer(offset, buffer) {
      this.offset = offset;
      this.buffer = buffer;
    }
    int16() {
      const result = this.buffer.readInt16BE(this.offset);
      this.offset += 2;
      return result;
    }
    byte() {
      const result = this.buffer[this.offset];
      this.offset++;
      return result;
    }
    int32() {
      const result = this.buffer.readInt32BE(this.offset);
      this.offset += 4;
      return result;
    }
    uint32() {
      const result = this.buffer.readUInt32BE(this.offset);
      this.offset += 4;
      return result;
    }
    string(length) {
      const result = this.buffer.toString(this.encoding, this.offset, this.offset + length);
      this.offset += length;
      return result;
    }
    cstring() {
      const start = this.offset;
      let end = start;
      while (this.buffer[end++]) {}
      this.offset = end;
      return this.buffer.toString(this.encoding, start, end - 1);
    }
    bytes(length) {
      const result = this.buffer.slice(this.offset, this.offset + length);
      this.offset += length;
      return result;
    }
  }
  exports.BufferReader = BufferReader;
});

// node_modules/pg-protocol/dist/parser.js
var require_parser = __commonJS(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Parser = undefined;
  var messages_1 = require_messages();
  var buffer_reader_1 = require_buffer_reader();
  var CODE_LENGTH = 1;
  var LEN_LENGTH = 4;
  var HEADER_LENGTH = CODE_LENGTH + LEN_LENGTH;
  var LATEINIT_LENGTH = -1;
  var emptyBuffer = Buffer.allocUnsafe(0);

  class Parser {
    constructor(opts) {
      this.buffer = emptyBuffer;
      this.bufferLength = 0;
      this.bufferOffset = 0;
      this.reader = new buffer_reader_1.BufferReader;
      if ((opts === null || opts === undefined ? undefined : opts.mode) === "binary") {
        throw new Error("Binary mode not supported yet");
      }
      this.mode = (opts === null || opts === undefined ? undefined : opts.mode) || "text";
    }
    parse(buffer, callback) {
      this.mergeBuffer(buffer);
      const bufferFullLength = this.bufferOffset + this.bufferLength;
      let offset = this.bufferOffset;
      while (offset + HEADER_LENGTH <= bufferFullLength) {
        const code = this.buffer[offset];
        const length = this.buffer.readUInt32BE(offset + CODE_LENGTH);
        const fullMessageLength = CODE_LENGTH + length;
        if (fullMessageLength + offset <= bufferFullLength) {
          const message = this.handlePacket(offset + HEADER_LENGTH, code, length, this.buffer);
          callback(message);
          offset += fullMessageLength;
        } else {
          break;
        }
      }
      if (offset === bufferFullLength) {
        this.buffer = emptyBuffer;
        this.bufferLength = 0;
        this.bufferOffset = 0;
      } else {
        this.bufferLength = bufferFullLength - offset;
        this.bufferOffset = offset;
      }
    }
    mergeBuffer(buffer) {
      if (this.bufferLength > 0) {
        const newLength = this.bufferLength + buffer.byteLength;
        const newFullLength = newLength + this.bufferOffset;
        if (newFullLength > this.buffer.byteLength) {
          let newBuffer;
          if (newLength <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) {
            newBuffer = this.buffer;
          } else {
            let newBufferLength = this.buffer.byteLength * 2;
            while (newLength >= newBufferLength) {
              newBufferLength *= 2;
            }
            newBuffer = Buffer.allocUnsafe(newBufferLength);
          }
          this.buffer.copy(newBuffer, 0, this.bufferOffset, this.bufferOffset + this.bufferLength);
          this.buffer = newBuffer;
          this.bufferOffset = 0;
        }
        buffer.copy(this.buffer, this.bufferOffset + this.bufferLength);
        this.bufferLength = newLength;
      } else {
        this.buffer = buffer;
        this.bufferOffset = 0;
        this.bufferLength = buffer.byteLength;
      }
    }
    handlePacket(offset, code, length, bytes) {
      const { reader } = this;
      reader.setBuffer(offset, bytes);
      let message;
      switch (code) {
        case 50:
          message = messages_1.bindComplete;
          break;
        case 49:
          message = messages_1.parseComplete;
          break;
        case 51:
          message = messages_1.closeComplete;
          break;
        case 110:
          message = messages_1.noData;
          break;
        case 115:
          message = messages_1.portalSuspended;
          break;
        case 99:
          message = messages_1.copyDone;
          break;
        case 87:
          message = messages_1.replicationStart;
          break;
        case 73:
          message = messages_1.emptyQuery;
          break;
        case 68:
          message = parseDataRowMessage(reader);
          break;
        case 67:
          message = parseCommandCompleteMessage(reader);
          break;
        case 90:
          message = parseReadyForQueryMessage(reader);
          break;
        case 65:
          message = parseNotificationMessage(reader);
          break;
        case 82:
          message = parseAuthenticationResponse(reader, length);
          break;
        case 83:
          message = parseParameterStatusMessage(reader);
          break;
        case 75:
          message = parseBackendKeyData(reader);
          break;
        case 69:
          message = parseErrorMessage(reader, "error");
          break;
        case 78:
          message = parseErrorMessage(reader, "notice");
          break;
        case 84:
          message = parseRowDescriptionMessage(reader);
          break;
        case 116:
          message = parseParameterDescriptionMessage(reader);
          break;
        case 71:
          message = parseCopyInMessage(reader);
          break;
        case 72:
          message = parseCopyOutMessage(reader);
          break;
        case 100:
          message = parseCopyData(reader, length);
          break;
        default:
          return new messages_1.DatabaseError("received invalid response: " + code.toString(16), length, "error");
      }
      reader.setBuffer(0, emptyBuffer);
      message.length = length;
      return message;
    }
  }
  exports.Parser = Parser;
  var parseReadyForQueryMessage = (reader) => {
    const status = reader.string(1);
    return new messages_1.ReadyForQueryMessage(LATEINIT_LENGTH, status);
  };
  var parseCommandCompleteMessage = (reader) => {
    const text = reader.cstring();
    return new messages_1.CommandCompleteMessage(LATEINIT_LENGTH, text);
  };
  var parseCopyData = (reader, length) => {
    const chunk = reader.bytes(length - 4);
    return new messages_1.CopyDataMessage(LATEINIT_LENGTH, chunk);
  };
  var parseCopyInMessage = (reader) => parseCopyMessage(reader, "copyInResponse");
  var parseCopyOutMessage = (reader) => parseCopyMessage(reader, "copyOutResponse");
  var parseCopyMessage = (reader, messageName) => {
    const isBinary = reader.byte() !== 0;
    const columnCount = reader.int16();
    const message = new messages_1.CopyResponse(LATEINIT_LENGTH, messageName, isBinary, columnCount);
    for (let i = 0;i < columnCount; i++) {
      message.columnTypes[i] = reader.int16();
    }
    return message;
  };
  var parseNotificationMessage = (reader) => {
    const processId = reader.int32();
    const channel = reader.cstring();
    const payload = reader.cstring();
    return new messages_1.NotificationResponseMessage(LATEINIT_LENGTH, processId, channel, payload);
  };
  var parseRowDescriptionMessage = (reader) => {
    const fieldCount = reader.int16();
    const message = new messages_1.RowDescriptionMessage(LATEINIT_LENGTH, fieldCount);
    for (let i = 0;i < fieldCount; i++) {
      message.fields[i] = parseField(reader);
    }
    return message;
  };
  var parseField = (reader) => {
    const name = reader.cstring();
    const tableID = reader.uint32();
    const columnID = reader.int16();
    const dataTypeID = reader.uint32();
    const dataTypeSize = reader.int16();
    const dataTypeModifier = reader.int32();
    const mode = reader.int16() === 0 ? "text" : "binary";
    return new messages_1.Field(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, mode);
  };
  var parseParameterDescriptionMessage = (reader) => {
    const parameterCount = reader.int16();
    const message = new messages_1.ParameterDescriptionMessage(LATEINIT_LENGTH, parameterCount);
    for (let i = 0;i < parameterCount; i++) {
      message.dataTypeIDs[i] = reader.uint32();
    }
    return message;
  };
  var parseDataRowMessage = (reader) => {
    const fieldCount = reader.int16();
    const fields = new Array(fieldCount);
    for (let i = 0;i < fieldCount; i++) {
      const len = reader.int32();
      fields[i] = len === -1 ? null : reader.string(len);
    }
    return new messages_1.DataRowMessage(LATEINIT_LENGTH, fields);
  };
  var parseParameterStatusMessage = (reader) => {
    const name = reader.cstring();
    const value = reader.cstring();
    return new messages_1.ParameterStatusMessage(LATEINIT_LENGTH, name, value);
  };
  var parseBackendKeyData = (reader) => {
    const processID = reader.int32();
    const secretKey = reader.int32();
    return new messages_1.BackendKeyDataMessage(LATEINIT_LENGTH, processID, secretKey);
  };
  var parseAuthenticationResponse = (reader, length) => {
    const code = reader.int32();
    const message = {
      name: "authenticationOk",
      length
    };
    switch (code) {
      case 0:
        break;
      case 3:
        if (message.length === 8) {
          message.name = "authenticationCleartextPassword";
        }
        break;
      case 5:
        if (message.length === 12) {
          message.name = "authenticationMD5Password";
          const salt = reader.bytes(4);
          return new messages_1.AuthenticationMD5Password(LATEINIT_LENGTH, salt);
        }
        break;
      case 10:
        {
          message.name = "authenticationSASL";
          message.mechanisms = [];
          let mechanism;
          do {
            mechanism = reader.cstring();
            if (mechanism) {
              message.mechanisms.push(mechanism);
            }
          } while (mechanism);
        }
        break;
      case 11:
        message.name = "authenticationSASLContinue";
        message.data = reader.string(length - 8);
        break;
      case 12:
        message.name = "authenticationSASLFinal";
        message.data = reader.string(length - 8);
        break;
      default:
        throw new Error("Unknown authenticationOk message type " + code);
    }
    return message;
  };
  var parseErrorMessage = (reader, name) => {
    const fields = {};
    let fieldType = reader.string(1);
    while (fieldType !== "\x00") {
      fields[fieldType] = reader.cstring();
      fieldType = reader.string(1);
    }
    const messageValue = fields.M;
    const message = name === "notice" ? new messages_1.NoticeMessage(LATEINIT_LENGTH, messageValue) : new messages_1.DatabaseError(messageValue, LATEINIT_LENGTH, name);
    message.severity = fields.S;
    message.code = fields.C;
    message.detail = fields.D;
    message.hint = fields.H;
    message.position = fields.P;
    message.internalPosition = fields.p;
    message.internalQuery = fields.q;
    message.where = fields.W;
    message.schema = fields.s;
    message.table = fields.t;
    message.column = fields.c;
    message.dataType = fields.d;
    message.constraint = fields.n;
    message.file = fields.F;
    message.line = fields.L;
    message.routine = fields.R;
    return message;
  };
});

// node_modules/pg-protocol/dist/index.js
var require_dist = __commonJS(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.DatabaseError = exports.serialize = undefined;
  exports.parse = parse;
  var messages_1 = require_messages();
  Object.defineProperty(exports, "DatabaseError", { enumerable: true, get: function() {
    return messages_1.DatabaseError;
  } });
  var serializer_1 = require_serializer();
  Object.defineProperty(exports, "serialize", { enumerable: true, get: function() {
    return serializer_1.serialize;
  } });
  var parser_1 = require_parser();
  function parse(stream, callback) {
    const parser = new parser_1.Parser;
    stream.on("data", (buffer) => parser.parse(buffer, callback));
    return new Promise((resolve) => stream.on("end", () => resolve()));
  }
});

// node_modules/pg-cloudflare/dist/empty.js
var require_empty = __commonJS(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = {};
});

// node_modules/pg/lib/stream.js
var require_stream = __commonJS(function(exports, module) {
  var { getStream, getSecureStream } = getStreamFuncs();
  module.exports = {
    getStream,
    getSecureStream
  };
  function getNodejsStreamFuncs() {
    function getStream(ssl) {
      const net = __require("net");
      return new net.Socket;
    }
    function getSecureStream(options) {
      const tls = __require("tls");
      return tls.connect(options);
    }
    return {
      getStream,
      getSecureStream
    };
  }
  function getCloudflareStreamFuncs() {
    function getStream(ssl) {
      const { CloudflareSocket } = require_empty();
      return new CloudflareSocket(ssl);
    }
    function getSecureStream(options) {
      options.socket.startTls(options);
      return options.socket;
    }
    return {
      getStream,
      getSecureStream
    };
  }
  function isCloudflareRuntime() {
    if (typeof navigator === "object" && navigator !== null && typeof navigator.userAgent === "string") {
      return navigator.userAgent === "Cloudflare-Workers";
    }
    if (typeof Response === "function") {
      const resp = new Response(null, { cf: { thing: true } });
      if (typeof resp.cf === "object" && resp.cf !== null && resp.cf.thing) {
        return true;
      }
    }
    return false;
  }
  function getStreamFuncs() {
    if (isCloudflareRuntime()) {
      return getCloudflareStreamFuncs();
    }
    return getNodejsStreamFuncs();
  }
});

// node_modules/pg/lib/connection.js
var require_connection = __commonJS(function(exports, module) {
  var EventEmitter = __require("events").EventEmitter;
  var { parse, serialize } = require_dist();
  var stream = require_stream();
  var { getStream } = stream;
  var flushBuffer = serialize.flush();
  var syncBuffer = serialize.sync();
  var endBuffer = serialize.end();

  class Connection extends EventEmitter {
    constructor(config) {
      super();
      config = config || {};
      this.stream = config.stream || getStream(config.ssl);
      if (typeof this.stream === "function") {
        this.stream = this.stream(config);
      }
      this._keepAlive = config.keepAlive;
      this._keepAliveInitialDelayMillis = config.keepAliveInitialDelayMillis;
      this.parsedStatements = {};
      this.submittedNamedStatements = {};
      this.ssl = config.ssl || false;
      this.sslNegotiation = config.sslNegotiation || "postgres";
      this._ending = false;
      this._emitMessage = false;
      const self = this;
      this.on("newListener", function(eventName) {
        if (eventName === "message") {
          self._emitMessage = true;
        }
      });
    }
    connect(port, host) {
      const self = this;
      this._connecting = true;
      this.stream.setNoDelay(true);
      this.stream.connect(port, host);
      this.stream.once("connect", function() {
        if (self._keepAlive) {
          self.stream.setKeepAlive(true, self._keepAliveInitialDelayMillis);
        }
        self.emit("connect");
      });
      const reportStreamError = function(error) {
        if (self._ending && (error.code === "ECONNRESET" || error.code === "EPIPE")) {
          return;
        }
        self.emit("error", error);
      };
      this.stream.on("error", reportStreamError);
      this.stream.on("close", function() {
        self.emit("end");
      });
      if (!this.ssl) {
        return this.attachListeners(this.stream);
      }
      if (this.sslNegotiation === "direct") {
        return this.stream.once("connect", function() {
          self.upgradeToSSL(host, reportStreamError);
        });
      }
      this.stream.once("data", function(buffer) {
        const responseCode = buffer.toString("utf8");
        switch (responseCode) {
          case "S":
            break;
          case "N":
            self.stream.end();
            return self.emit("error", new Error("The server does not support SSL connections"));
          default:
            self.stream.end();
            return self.emit("error", new Error("There was an error establishing an SSL connection"));
        }
        self.upgradeToSSL(host, reportStreamError);
      });
    }
    upgradeToSSL(host, reportStreamError) {
      const self = this;
      const options = {
        socket: self.stream
      };
      if (self.ssl !== true) {
        Object.assign(options, self.ssl);
        if ("key" in self.ssl) {
          options.key = self.ssl.key;
        }
      }
      if (self.sslNegotiation === "direct") {
        options.ALPNProtocols = ["postgresql"];
      }
      const net = __require("net");
      if (net.isIP && net.isIP(host) === 0) {
        options.servername = host;
      }
      try {
        self.stream = stream.getSecureStream(options);
      } catch (err) {
        return self.emit("error", err);
      }
      self.attachListeners(self.stream);
      self.stream.on("error", reportStreamError);
      self.emit("sslconnect");
    }
    attachListeners(stream) {
      parse(stream, (msg) => {
        const eventName = msg.name === "error" ? "errorMessage" : msg.name;
        if (this._emitMessage) {
          this.emit("message", msg);
        }
        this.emit(eventName, msg);
      });
    }
    requestSsl() {
      this.stream.write(serialize.requestSsl());
    }
    startup(config) {
      this.stream.write(serialize.startup(config));
    }
    cancel(processID, secretKey) {
      this._send(serialize.cancel(processID, secretKey));
    }
    password(password) {
      this._send(serialize.password(password));
    }
    sendSASLInitialResponseMessage(mechanism, initialResponse) {
      this._send(serialize.sendSASLInitialResponseMessage(mechanism, initialResponse));
    }
    sendSCRAMClientFinalMessage(additionalData) {
      this._send(serialize.sendSCRAMClientFinalMessage(additionalData));
    }
    _send(buffer) {
      if (!this.stream.writable) {
        return false;
      }
      return this.stream.write(buffer);
    }
    query(text) {
      this._send(serialize.query(text));
    }
    parse(query) {
      this._send(serialize.parse(query));
    }
    bind(config) {
      this._send(serialize.bind(config));
    }
    execute(config) {
      this._send(serialize.execute(config));
    }
    flush() {
      if (this.stream.writable) {
        this.stream.write(flushBuffer);
      }
    }
    sync() {
      this._ending = true;
      this._send(syncBuffer);
    }
    ref() {
      this.stream.ref();
    }
    unref() {
      this.stream.unref();
    }
    end() {
      this._ending = true;
      if (!this._connecting || !this.stream.writable) {
        this.stream.end();
        return;
      }
      return this.stream.write(endBuffer, () => {
        this.stream.end();
      });
    }
    close(msg) {
      this._send(serialize.close(msg));
    }
    describe(msg) {
      this._send(serialize.describe(msg));
    }
    sendCopyFromChunk(chunk) {
      this._send(serialize.copyData(chunk));
    }
    endCopyFrom() {
      this._send(serialize.copyDone());
    }
    sendCopyFail(msg) {
      this._send(serialize.copyFail(msg));
    }
  }
  module.exports = Connection;
});

// node_modules/split2/index.js
var require_split2 = __commonJS(function(exports, module) {
  var { Transform } = __require("stream");
  var { StringDecoder } = __require("string_decoder");
  var kLast = Symbol("last");
  var kDecoder = Symbol("decoder");
  function transform(chunk, enc, cb) {
    let list;
    if (this.overflow) {
      const buf = this[kDecoder].write(chunk);
      list = buf.split(this.matcher);
      if (list.length === 1)
        return cb();
      list.shift();
      this.overflow = false;
    } else {
      this[kLast] += this[kDecoder].write(chunk);
      list = this[kLast].split(this.matcher);
    }
    this[kLast] = list.pop();
    for (let i = 0;i < list.length; i++) {
      try {
        push(this, this.mapper(list[i]));
      } catch (error) {
        return cb(error);
      }
    }
    this.overflow = this[kLast].length > this.maxLength;
    if (this.overflow && !this.skipOverflow) {
      cb(new Error("maximum buffer reached"));
      return;
    }
    cb();
  }
  function flush(cb) {
    this[kLast] += this[kDecoder].end();
    if (this[kLast]) {
      try {
        push(this, this.mapper(this[kLast]));
      } catch (error) {
        return cb(error);
      }
    }
    cb();
  }
  function push(self, val) {
    if (val !== undefined) {
      self.push(val);
    }
  }
  function noop(incoming) {
    return incoming;
  }
  function split(matcher, mapper, options) {
    matcher = matcher || /\r?\n/;
    mapper = mapper || noop;
    options = options || {};
    switch (arguments.length) {
      case 1:
        if (typeof matcher === "function") {
          mapper = matcher;
          matcher = /\r?\n/;
        } else if (typeof matcher === "object" && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
          options = matcher;
          matcher = /\r?\n/;
        }
        break;
      case 2:
        if (typeof matcher === "function") {
          options = mapper;
          mapper = matcher;
          matcher = /\r?\n/;
        } else if (typeof mapper === "object") {
          options = mapper;
          mapper = noop;
        }
    }
    options = Object.assign({}, options);
    options.autoDestroy = true;
    options.transform = transform;
    options.flush = flush;
    options.readableObjectMode = true;
    const stream = new Transform(options);
    stream[kLast] = "";
    stream[kDecoder] = new StringDecoder("utf8");
    stream.matcher = matcher;
    stream.mapper = mapper;
    stream.maxLength = options.maxLength;
    stream.skipOverflow = options.skipOverflow || false;
    stream.overflow = false;
    stream._destroy = function(err, cb) {
      this._writableState.errorEmitted = false;
      cb(err);
    };
    return stream;
  }
  module.exports = split;
});

// node_modules/pgpass/lib/helper.js
var require_helper = __commonJS(function(exports, module) {
  var path = __require("path");
  var Stream = __require("stream").Stream;
  var split = require_split2();
  var util = __require("util");
  var defaultPort = 5432;
  var isWin = process.platform === "win32";
  var warnStream = process.stderr;
  var S_IRWXG = 56;
  var S_IRWXO = 7;
  var S_IFMT = 61440;
  var S_IFREG = 32768;
  function isRegFile(mode) {
    return (mode & S_IFMT) == S_IFREG;
  }
  var fieldNames = ["host", "port", "database", "user", "password"];
  var nrOfFields = fieldNames.length;
  var passKey = fieldNames[nrOfFields - 1];
  function warn() {
    var isWritable = warnStream instanceof Stream && warnStream.writable === true;
    if (isWritable) {
      var args = Array.prototype.slice.call(arguments).concat(`
`);
      warnStream.write(util.format.apply(util, args));
    }
  }
  Object.defineProperty(exports, "isWin", {
    get: function() {
      return isWin;
    },
    set: function(val) {
      isWin = val;
    }
  });
  exports.warnTo = function(stream) {
    var old = warnStream;
    warnStream = stream;
    return old;
  };
  exports.getFileName = function(rawEnv) {
    var env = rawEnv || process.env;
    var file = env.PGPASSFILE || (isWin ? path.join(env.APPDATA || "./", "postgresql", "pgpass.conf") : path.join(env.HOME || "./", ".pgpass"));
    return file;
  };
  exports.usePgPass = function(stats, fname) {
    if (Object.prototype.hasOwnProperty.call(process.env, "PGPASSWORD")) {
      return false;
    }
    if (isWin) {
      return true;
    }
    fname = fname || "<unkn>";
    if (!isRegFile(stats.mode)) {
      warn('WARNING: password file "%s" is not a plain file', fname);
      return false;
    }
    if (stats.mode & (S_IRWXG | S_IRWXO)) {
      warn('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', fname);
      return false;
    }
    return true;
  };
  var matcher = exports.match = function(connInfo, entry) {
    return fieldNames.slice(0, -1).reduce(function(prev, field, idx) {
      if (idx == 1) {
        if (Number(connInfo[field] || defaultPort) === Number(entry[field])) {
          return prev && true;
        }
      }
      return prev && (entry[field] === "*" || entry[field] === connInfo[field]);
    }, true);
  };
  exports.getPassword = function(connInfo, stream, cb) {
    var pass;
    var lineStream = stream.pipe(split());
    function onLine(line) {
      var entry = parseLine(line);
      if (entry && isValidEntry(entry) && matcher(connInfo, entry)) {
        pass = entry[passKey];
        lineStream.end();
      }
    }
    var onEnd = function() {
      stream.destroy();
      cb(pass);
    };
    var onErr = function(err) {
      stream.destroy();
      warn("WARNING: error on reading file: %s", err);
      cb(undefined);
    };
    stream.on("error", onErr);
    lineStream.on("data", onLine).on("end", onEnd).on("error", onErr);
  };
  var parseLine = exports.parseLine = function(line) {
    if (line.length < 11 || line.match(/^\s+#/)) {
      return null;
    }
    var curChar = "";
    var prevChar = "";
    var fieldIdx = 0;
    var startIdx = 0;
    var endIdx = 0;
    var obj = {};
    var isLastField = false;
    var addToObj = function(idx, i0, i1) {
      var field = line.substring(i0, i1);
      if (!Object.hasOwnProperty.call(process.env, "PGPASS_NO_DEESCAPE")) {
        field = field.replace(/\\([:\\])/g, "$1");
      }
      obj[fieldNames[idx]] = field;
    };
    for (var i = 0;i < line.length - 1; i += 1) {
      curChar = line.charAt(i + 1);
      prevChar = line.charAt(i);
      isLastField = fieldIdx == nrOfFields - 1;
      if (isLastField) {
        addToObj(fieldIdx, startIdx);
        break;
      }
      if (i >= 0 && curChar == ":" && prevChar !== "\\") {
        addToObj(fieldIdx, startIdx, i + 1);
        startIdx = i + 2;
        fieldIdx += 1;
      }
    }
    obj = Object.keys(obj).length === nrOfFields ? obj : null;
    return obj;
  };
  var isValidEntry = exports.isValidEntry = function(entry) {
    var rules = {
      0: function(x) {
        return x.length > 0;
      },
      1: function(x) {
        if (x === "*") {
          return true;
        }
        x = Number(x);
        return isFinite(x) && x > 0 && x < 9007199254740992 && Math.floor(x) === x;
      },
      2: function(x) {
        return x.length > 0;
      },
      3: function(x) {
        return x.length > 0;
      },
      4: function(x) {
        return x.length > 0;
      }
    };
    for (var idx = 0;idx < fieldNames.length; idx += 1) {
      var rule = rules[idx];
      var value = entry[fieldNames[idx]] || "";
      var res = rule(value);
      if (!res) {
        return false;
      }
    }
    return true;
  };
});

// node_modules/pgpass/lib/index.js
var require_lib = __commonJS(function(exports, module) {
  var path = __require("path");
  var fs = __require("fs");
  var helper = require_helper();
  module.exports = function(connInfo, cb) {
    var file = helper.getFileName();
    fs.stat(file, function(err, stat) {
      if (err || !helper.usePgPass(stat, file)) {
        return cb(undefined);
      }
      var st = fs.createReadStream(file);
      helper.getPassword(connInfo, st, cb);
    });
  };
  module.exports.warnTo = helper.warnTo;
});

// node_modules/pg/lib/client.js
var require_client = __commonJS(function(exports, module) {
  var EventEmitter = __require("events").EventEmitter;
  var utils = require_utils();
  var nodeUtils = __require("util");
  var sasl = require_sasl();
  var TypeOverrides = require_type_overrides();
  var ConnectionParameters = require_connection_parameters();
  var Query = require_query();
  var defaults = require_defaults();
  var Connection = require_connection();
  var crypto2 = require_utils2();
  var activeQueryDeprecationNotice = nodeUtils.deprecate(() => {}, "Client.activeQuery is deprecated and will be removed in pg@9.0");
  var queryQueueDeprecationNotice = nodeUtils.deprecate(() => {}, "Client.queryQueue is deprecated and will be removed in pg@9.0.");
  var pgPassDeprecationNotice = nodeUtils.deprecate(() => {}, "pgpass support is deprecated and will be removed in pg@9.0. " + "You can provide an async function as the password property to the Client/Pool constructor that returns a password instead. Within this function you can call the pgpass module in your own code.");
  var byoPromiseDeprecationNotice = nodeUtils.deprecate(() => {}, "Passing a custom Promise implementation to the Client/Pool constructor is deprecated and will be removed in pg@9.0.");
  var queryQueueLengthDeprecationNotice = nodeUtils.deprecate(() => {}, "Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");
  function coerceNumberOrDefault(value, defaultValue) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : defaultValue;
    }
    if (typeof value === "string" && value.trim() !== "") {
      const n = Number(value);
      return Number.isFinite(n) ? n : defaultValue;
    }
    return defaultValue;
  }

  class Client extends EventEmitter {
    constructor(config) {
      super();
      this.connectionParameters = new ConnectionParameters(config);
      this.user = this.connectionParameters.user;
      this.database = this.connectionParameters.database;
      this.port = this.connectionParameters.port;
      this.host = this.connectionParameters.host;
      Object.defineProperty(this, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: this.connectionParameters.password
      });
      this.replication = this.connectionParameters.replication;
      const c = config || {};
      if (c.Promise) {
        byoPromiseDeprecationNotice();
      }
      this._Promise = c.Promise || global.Promise;
      this._types = new TypeOverrides(c.types);
      this._ending = false;
      this._ended = false;
      this._connecting = false;
      this._connected = false;
      this._connectionError = false;
      this._queryable = true;
      this._activeQuery = null;
      this._txStatus = null;
      this.enableChannelBinding = Boolean(c.enableChannelBinding);
      this.scramMaxIterations = coerceNumberOrDefault(c.scramMaxIterations, sasl.DEFAULT_MAX_SCRAM_ITERATIONS);
      this.connection = c.connection || new Connection({
        stream: c.stream,
        ssl: this.connectionParameters.ssl,
        sslNegotiation: this.connectionParameters.sslnegotiation,
        keepAlive: c.keepAlive || false,
        keepAliveInitialDelayMillis: c.keepAliveInitialDelayMillis || 0,
        encoding: this.connectionParameters.client_encoding || "utf8"
      });
      this._queryQueue = [];
      this._sentQueryQueue = [];
      this.pipeline = Boolean(c.pipeline);
      this.binary = c.binary || defaults.binary;
      this.processID = null;
      this.secretKey = null;
      this.ssl = this.connectionParameters.ssl || false;
      this.sslNegotiation = this.connectionParameters.sslnegotiation || "postgres";
      if (this.ssl && this.ssl.key) {
        Object.defineProperty(this.ssl, "key", {
          enumerable: false
        });
      }
      this._connectionTimeoutMillis = c.connectionTimeoutMillis || 0;
    }
    get activeQuery() {
      activeQueryDeprecationNotice();
      return this._activeQuery;
    }
    set activeQuery(val) {
      activeQueryDeprecationNotice();
      this._activeQuery = val;
    }
    _getActiveQuery() {
      return this._activeQuery;
    }
    _errorAllQueries(err) {
      const enqueueError = (query) => {
        process.nextTick(() => {
          query.handleError(err, this.connection);
        });
      };
      const activeQuery = this._getActiveQuery();
      if (activeQuery) {
        enqueueError(activeQuery);
        this._activeQuery = null;
      }
      this._sentQueryQueue.forEach(enqueueError);
      this._sentQueryQueue.length = 0;
      this._queryQueue.forEach(enqueueError);
      this._queryQueue.length = 0;
    }
    _connect(callback) {
      const self = this;
      const con = this.connection;
      this._connectionCallback = callback;
      if (this._connecting || this._connected) {
        const err = new Error("Client has already been connected. You cannot reuse a client.");
        process.nextTick(() => {
          callback(err);
        });
        return;
      }
      this._connecting = true;
      if (this._connectionTimeoutMillis > 0) {
        this.connectionTimeoutHandle = setTimeout(() => {
          con._ending = true;
          con.stream.destroy(new Error("timeout expired"));
        }, this._connectionTimeoutMillis);
        if (this.connectionTimeoutHandle.unref) {
          this.connectionTimeoutHandle.unref();
        }
      }
      if (this.host && this.host.indexOf("/") === 0) {
        con.connect(this.host + "/.s.PGSQL." + this.port);
      } else {
        con.connect(this.port, this.host);
      }
      con.on("connect", function() {
        if (self.ssl) {
          if (self.sslNegotiation !== "direct") {
            con.requestSsl();
          }
        } else {
          con.startup(self.getStartupConf());
        }
      });
      con.on("sslconnect", function() {
        con.startup(self.getStartupConf());
      });
      this._attachListeners(con);
      con.once("end", () => {
        const error = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
        clearTimeout(this.connectionTimeoutHandle);
        this._errorAllQueries(error);
        this._ended = true;
        if (!this._ending) {
          if (this._connecting && !this._connectionError) {
            if (this._connectionCallback) {
              this._connectionCallback(error);
            } else {
              this._handleErrorEvent(error);
            }
          } else if (!this._connectionError) {
            this._handleErrorEvent(error);
          }
        }
        process.nextTick(() => {
          this.emit("end");
        });
      });
    }
    connect(callback) {
      if (callback) {
        this._connect(callback);
        return;
      }
      return new this._Promise((resolve, reject) => {
        this._connect((error) => {
          if (error) {
            reject(error);
          } else {
            resolve(this);
          }
        });
      });
    }
    _attachListeners(con) {
      con.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this));
      con.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this));
      con.on("authenticationSASL", this._handleAuthSASL.bind(this));
      con.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this));
      con.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this));
      con.on("backendKeyData", this._handleBackendKeyData.bind(this));
      con.on("error", this._handleErrorEvent.bind(this));
      con.on("errorMessage", this._handleErrorMessage.bind(this));
      con.on("readyForQuery", this._handleReadyForQuery.bind(this));
      con.on("notice", this._handleNotice.bind(this));
      con.on("rowDescription", this._handleRowDescription.bind(this));
      con.on("dataRow", this._handleDataRow.bind(this));
      con.on("portalSuspended", this._handlePortalSuspended.bind(this));
      con.on("emptyQuery", this._handleEmptyQuery.bind(this));
      con.on("commandComplete", this._handleCommandComplete.bind(this));
      con.on("parseComplete", this._handleParseComplete.bind(this));
      con.on("copyInResponse", this._handleCopyInResponse.bind(this));
      con.on("copyData", this._handleCopyData.bind(this));
      con.on("notification", this._handleNotification.bind(this));
    }
    _getPassword(cb) {
      const con = this.connection;
      if (typeof this.password === "function") {
        this._Promise.resolve().then(() => this.password(this.connectionParameters)).then((pass) => {
          if (pass !== undefined) {
            if (typeof pass !== "string") {
              con.emit("error", new TypeError("Password must be a string"));
              return;
            }
            this.connectionParameters.password = this.password = pass;
          } else {
            this.connectionParameters.password = this.password = null;
          }
          cb();
        }).catch((err) => {
          con.emit("error", err);
        });
      } else if (this.password !== null) {
        cb();
      } else {
        try {
          const pgPass = require_lib();
          pgPass(this.connectionParameters, (pass) => {
            if (pass !== undefined) {
              pgPassDeprecationNotice();
              this.connectionParameters.password = this.password = pass;
            }
            cb();
          });
        } catch (e) {
          this.emit("error", e);
        }
      }
    }
    _handleAuthCleartextPassword(msg) {
      this._getPassword(() => {
        this.connection.password(this.password);
      });
    }
    _handleAuthMD5Password(msg) {
      this._getPassword(async () => {
        try {
          const hashedPassword = await crypto2.postgresMd5PasswordHash(this.user, this.password, msg.salt);
          this.connection.password(hashedPassword);
        } catch (e) {
          this.emit("error", e);
        }
      });
    }
    _handleAuthSASL(msg) {
      this._getPassword(() => {
        try {
          this.saslSession = sasl.startSession(msg.mechanisms, this.enableChannelBinding && this.connection.stream, this.scramMaxIterations);
          this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response);
        } catch (err) {
          this.connection.emit("error", err);
        }
      });
    }
    async _handleAuthSASLContinue(msg) {
      try {
        await sasl.continueSession(this.saslSession, this.password, msg.data, this.enableChannelBinding && this.connection.stream);
        this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
      } catch (err) {
        this.connection.emit("error", err);
      }
    }
    _handleAuthSASLFinal(msg) {
      try {
        sasl.finalizeSession(this.saslSession, msg.data);
        this.saslSession = null;
      } catch (err) {
        this.connection.emit("error", err);
      }
    }
    _handleBackendKeyData(msg) {
      this.processID = msg.processID;
      this.secretKey = msg.secretKey;
    }
    _handleReadyForQuery(msg) {
      if (this._connecting) {
        this._connecting = false;
        this._connected = true;
        clearTimeout(this.connectionTimeoutHandle);
        if (this._connectionCallback) {
          this._connectionCallback(null, this);
          this._connectionCallback = null;
        }
        this.emit("connect");
      }
      const activeQuery = this._getActiveQuery();
      this._activeQuery = null;
      this._txStatus = msg?.status ?? null;
      this.readyForQuery = true;
      if (activeQuery) {
        activeQuery.handleReadyForQuery(this.connection);
      }
      this._pulseQueryQueue();
    }
    _handleErrorWhileConnecting(err) {
      if (this._connectionError) {
        return;
      }
      this._connectionError = true;
      clearTimeout(this.connectionTimeoutHandle);
      if (this._connectionCallback) {
        return this._connectionCallback(err);
      }
      this.emit("error", err);
    }
    _handleErrorEvent(err) {
      if (this._connecting) {
        return this._handleErrorWhileConnecting(err);
      }
      this._queryable = false;
      this._errorAllQueries(err);
      this.emit("error", err);
    }
    _handleErrorMessage(msg) {
      if (this._connecting) {
        return this._handleErrorWhileConnecting(msg);
      }
      const activeQuery = this._getActiveQuery();
      if (!activeQuery) {
        this._handleErrorEvent(msg);
        return;
      }
      this._activeQuery = null;
      if (activeQuery.name) {
        delete this.connection.submittedNamedStatements[activeQuery.name];
      }
      activeQuery.handleError(msg, this.connection);
    }
    _handleRowDescription(msg) {
      const activeQuery = this._getActiveQuery();
      if (activeQuery == null) {
        const error = new Error("Received unexpected rowDescription message from backend.");
        this._handleErrorEvent(error);
        return;
      }
      activeQuery.handleRowDescription(msg);
    }
    _handleDataRow(msg) {
      const activeQuery = this._getActiveQuery();
      if (activeQuery == null) {
        const error = new Error("Received unexpected dataRow message from backend.");
        this._handleErrorEvent(error);
        return;
      }
      activeQuery.handleDataRow(msg);
    }
    _handlePortalSuspended(msg) {
      const activeQuery = this._getActiveQuery();
      if (activeQuery == null) {
        const error = new Error("Received unexpected portalSuspended message from backend.");
        this._handleErrorEvent(error);
        return;
      }
      activeQuery.handlePortalSuspended(this.connection);
    }
    _handleEmptyQuery(msg) {
      const activeQuery = this._getActiveQuery();
      if (activeQuery == null) {
        const error = new Error("Received unexpected emptyQuery message from backend.");
        this._handleErrorEvent(error);
        return;
      }
      activeQuery.handleEmptyQuery(this.connection);
    }
    _handleCommandComplete(msg) {
      const activeQuery = this._getActiveQuery();
      if (activeQuery == null) {
        const error = new Error("Received unexpected commandComplete message from backend.");
        this._handleErrorEvent(error);
        return;
      }
      activeQuery.handleCommandComplete(msg, this.connection);
    }
    _handleParseComplete() {
      const activeQuery = this._getActiveQuery();
      if (activeQuery == null) {
        const error = new Error("Received unexpected parseComplete message from backend.");
        this._handleErrorEvent(error);
        return;
      }
      if (activeQuery.name) {
        this.connection.parsedStatements[activeQuery.name] = activeQuery.text;
        delete this.connection.submittedNamedStatements[activeQuery.name];
      }
    }
    _handleCopyInResponse(msg) {
      const activeQuery = this._getActiveQuery();
      if (activeQuery == null) {
        const error = new Error("Received unexpected copyInResponse message from backend.");
        this._handleErrorEvent(error);
        return;
      }
      activeQuery.handleCopyInResponse(this.connection);
    }
    _handleCopyData(msg) {
      const activeQuery = this._getActiveQuery();
      if (activeQuery == null) {
        const error = new Error("Received unexpected copyData message from backend.");
        this._handleErrorEvent(error);
        return;
      }
      activeQuery.handleCopyData(msg, this.connection);
    }
    _handleNotification(msg) {
      this.emit("notification", msg);
    }
    _handleNotice(msg) {
      this.emit("notice", msg);
    }
    getStartupConf() {
      const params = this.connectionParameters;
      const data = {
        user: params.user,
        database: params.database
      };
      const appName = params.application_name || params.fallback_application_name;
      if (appName) {
        data.application_name = appName;
      }
      if (params.replication) {
        data.replication = "" + params.replication;
      }
      if (params.statement_timeout) {
        data.statement_timeout = String(parseInt(params.statement_timeout, 10));
      }
      if (params.lock_timeout) {
        data.lock_timeout = String(parseInt(params.lock_timeout, 10));
      }
      if (params.idle_in_transaction_session_timeout) {
        data.idle_in_transaction_session_timeout = String(parseInt(params.idle_in_transaction_session_timeout, 10));
      }
      if (params.options) {
        data.options = params.options;
      }
      return data;
    }
    cancel(client, query) {
      if (client.activeQuery === query) {
        const con = this.connection;
        if (this.host && this.host.indexOf("/") === 0) {
          con.connect(this.host + "/.s.PGSQL." + this.port);
        } else {
          con.connect(this.port, this.host);
        }
        con.on("connect", function() {
          con.cancel(client.processID, client.secretKey);
        });
      } else if (client._queryQueue.indexOf(query) !== -1) {
        client._queryQueue.splice(client._queryQueue.indexOf(query), 1);
      } else if (client._sentQueryQueue.indexOf(query) !== -1) {
        query.callback = () => {};
      }
    }
    setTypeParser(oid, format, parseFn) {
      return this._types.setTypeParser(oid, format, parseFn);
    }
    getTypeParser(oid, format) {
      return this._types.getTypeParser(oid, format);
    }
    escapeIdentifier(str) {
      return utils.escapeIdentifier(str);
    }
    escapeLiteral(str) {
      return utils.escapeLiteral(str);
    }
    _pulseQueryQueue() {
      if (this.pipeline) {
        this._pulsePipelinedQueryQueue();
        return;
      }
      if (this.readyForQuery === true) {
        this._activeQuery = this._queryQueue.shift();
        const activeQuery = this._getActiveQuery();
        if (activeQuery) {
          this.readyForQuery = false;
          this.hasExecuted = true;
          const queryError = activeQuery.submit(this.connection);
          if (queryError) {
            process.nextTick(() => {
              activeQuery.handleError(queryError, this.connection);
              this.readyForQuery = true;
              this._pulseQueryQueue();
            });
          }
        } else if (this.hasExecuted) {
          this._activeQuery = null;
          this.emit("drain");
        }
      }
    }
    _pulsePipelinedQueryQueue() {
      if (!this._connected || !this._queryable) {
        return;
      }
      while (this._queryQueue.length > 0) {
        const query = this._queryQueue.shift();
        this.hasExecuted = true;
        const queryError = query.submit(this.connection);
        if (queryError) {
          process.nextTick(() => {
            query.handleError(queryError, this.connection);
          });
          continue;
        }
        this._sentQueryQueue.push(query);
      }
      if (this.readyForQuery && !this._activeQuery && this._sentQueryQueue.length > 0) {
        this._activeQuery = this._sentQueryQueue.shift();
        this.readyForQuery = false;
      }
      if (!this._activeQuery && this._sentQueryQueue.length === 0 && this._queryQueue.length === 0 && this.hasExecuted) {
        this.emit("drain");
      }
    }
    query(config, values, callback) {
      let query;
      let result;
      if (config == null) {
        throw new TypeError("Client was passed a null or undefined query");
      }
      if (typeof config.submit === "function") {
        result = query = config;
        if (!query.callback) {
          if (typeof values === "function") {
            query.callback = values;
          } else if (callback) {
            query.callback = callback;
          }
        }
      } else {
        query = new Query(config, values, callback);
        if (!query.callback) {
          result = new this._Promise((resolve, reject) => {
            query.callback = (err, res) => err ? reject(err) : resolve(res);
          }).catch((err) => {
            Error.captureStackTrace(err);
            throw err;
          });
        } else if (typeof query.callback !== "function") {
          throw new TypeError("callback is not a function");
        }
      }
      const readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
      if (readTimeout) {
        const queryCallback = query.callback || (() => {});
        const readTimeoutTimer = setTimeout(() => {
          const error = new Error("Query read timeout");
          process.nextTick(() => {
            query.handleError(error, this.connection);
          });
          queryCallback(error);
          query.callback = () => {};
          const index = this._queryQueue.indexOf(query);
          if (index > -1) {
            this._queryQueue.splice(index, 1);
          } else if (this.pipeline) {
            this.connection.stream.destroy();
            return;
          }
          this._pulseQueryQueue();
        }, readTimeout);
        query.callback = (err, res) => {
          clearTimeout(readTimeoutTimer);
          queryCallback(err, res);
        };
      }
      if (this.binary && !query.binary) {
        query.binary = true;
      }
      if (query._result && !query._result._types) {
        query._result._types = this._types;
      }
      if (!this._queryable) {
        process.nextTick(() => {
          query.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
        });
        return result;
      }
      if (this._ending) {
        process.nextTick(() => {
          query.handleError(new Error("Client was closed and is not queryable"), this.connection);
        });
        return result;
      }
      if (this._queryQueue.length > 0 && !this.pipeline) {
        queryQueueLengthDeprecationNotice();
      }
      this._queryQueue.push(query);
      this._pulseQueryQueue();
      return result;
    }
    ref() {
      this.connection.ref();
    }
    unref() {
      this.connection.unref();
    }
    getTransactionStatus() {
      return this._txStatus;
    }
    end(cb) {
      this._ending = true;
      if (!this.connection._connecting || this._ended) {
        if (cb) {
          cb();
          return;
        } else {
          return this._Promise.resolve();
        }
      }
      if (!this._queryable) {
        this.connection.stream.destroy();
      } else if (this.pipeline && (this._getActiveQuery() || this._sentQueryQueue.length > 0 || this._queryQueue.length > 0)) {
        this.once("drain", () => this.connection.end());
      } else if (this._getActiveQuery()) {
        this.connection.stream.destroy();
      } else {
        this.connection.end();
      }
      if (cb) {
        this.connection.once("end", cb);
      } else {
        return new this._Promise((resolve) => {
          this.connection.once("end", resolve);
        });
      }
    }
    get queryQueue() {
      queryQueueDeprecationNotice();
      return this._queryQueue;
    }
  }
  Client.Query = Query;
  module.exports = Client;
});

// node_modules/pg-pool/index.js
var require_pg_pool = __commonJS(function(exports, module) {
  var EventEmitter = __require("events").EventEmitter;
  var NOOP = function() {};
  var removeWhere = (list, predicate) => {
    const i = list.findIndex(predicate);
    return i === -1 ? undefined : list.splice(i, 1)[0];
  };

  class IdleItem {
    constructor(client, idleListener, timeoutId) {
      this.client = client;
      this.idleListener = idleListener;
      this.timeoutId = timeoutId;
    }
  }

  class PendingItem {
    constructor(callback) {
      this.callback = callback;
    }
  }
  function throwOnDoubleRelease() {
    throw new Error("Release called on client which has already been released to the pool.");
  }
  function promisify(Promise2, callback) {
    if (callback) {
      return { callback, result: undefined };
    }
    let rej;
    let res;
    const cb = function(err, client) {
      err ? rej(err) : res(client);
    };
    const result = new Promise2(function(resolve, reject) {
      res = resolve;
      rej = reject;
    }).catch((err) => {
      Error.captureStackTrace(err);
      throw err;
    });
    return { callback: cb, result };
  }
  function makeIdleListener(pool, client) {
    return function idleListener(err) {
      err.client = client;
      client.removeListener("error", idleListener);
      client.on("error", () => {
        pool.log("additional client error after disconnection due to error", err);
      });
      pool._remove(client);
      pool.emit("error", err, client);
    };
  }

  class Pool extends EventEmitter {
    constructor(options, Client) {
      super();
      this.options = Object.assign({}, options);
      if (options != null && "password" in options) {
        Object.defineProperty(this.options, "password", {
          configurable: true,
          enumerable: false,
          writable: true,
          value: options.password
        });
      }
      if (options != null && options.ssl && options.ssl.key) {
        Object.defineProperty(this.options.ssl, "key", {
          enumerable: false
        });
      }
      this.options.max = this.options.max || this.options.poolSize || 10;
      this.options.min = this.options.min || 0;
      this.options.maxUses = this.options.maxUses || Infinity;
      this.options.allowExitOnIdle = this.options.allowExitOnIdle || false;
      this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0;
      this.log = this.options.log || function() {};
      this.Client = this.options.Client || Client || require_lib2().Client;
      this.Promise = this.options.Promise || global.Promise;
      if (typeof this.options.idleTimeoutMillis === "undefined") {
        this.options.idleTimeoutMillis = 1e4;
      }
      this._clients = [];
      this._idle = [];
      this._expired = new WeakSet;
      this._pendingQueue = [];
      this._endCallback = undefined;
      this.ending = false;
      this.ended = false;
    }
    _promiseTry(f) {
      const Promise2 = this.Promise;
      if (typeof Promise2.try === "function") {
        return Promise2.try(f);
      }
      return new Promise2((resolve) => resolve(f()));
    }
    _isFull() {
      return this._clients.length >= this.options.max;
    }
    _isAboveMin() {
      return this._clients.length > this.options.min;
    }
    _pulseQueue() {
      this.log("pulse queue");
      if (this.ended) {
        this.log("pulse queue ended");
        return;
      }
      if (this.ending) {
        this.log("pulse queue on ending");
        if (this._idle.length) {
          this._idle.slice().map((item) => {
            this._remove(item.client);
          });
        }
        if (!this._clients.length) {
          this.ended = true;
          this._endCallback();
        }
        return;
      }
      if (!this._pendingQueue.length) {
        this.log("no queued requests");
        return;
      }
      if (!this._idle.length && this._isFull()) {
        return;
      }
      const pendingItem = this._pendingQueue.shift();
      if (this._idle.length) {
        const idleItem = this._idle.pop();
        clearTimeout(idleItem.timeoutId);
        const client = idleItem.client;
        client.ref && client.ref();
        const idleListener = idleItem.idleListener;
        return this._acquireClient(client, pendingItem, idleListener, false);
      }
      if (!this._isFull()) {
        return this.newClient(pendingItem);
      }
      throw new Error("unexpected condition");
    }
    _remove(client, callback) {
      const removed = removeWhere(this._idle, (item) => item.client === client);
      if (removed !== undefined) {
        clearTimeout(removed.timeoutId);
      }
      this._clients = this._clients.filter((c) => c !== client);
      const context = this;
      client.end(() => {
        context.emit("remove", client);
        if (typeof callback === "function") {
          callback();
        }
      });
    }
    connect(cb) {
      if (this.ending) {
        const err = new Error("Cannot use a pool after calling end on the pool");
        return cb ? cb(err) : this.Promise.reject(err);
      }
      const response = promisify(this.Promise, cb);
      const result = response.result;
      if (this._isFull() || this._idle.length) {
        if (this._idle.length) {
          process.nextTick(() => this._pulseQueue());
        }
        if (!this.options.connectionTimeoutMillis) {
          this._pendingQueue.push(new PendingItem(response.callback));
          return result;
        }
        const queueCallback = (err, res, done) => {
          clearTimeout(tid);
          response.callback(err, res, done);
        };
        const pendingItem = new PendingItem(queueCallback);
        const tid = setTimeout(() => {
          removeWhere(this._pendingQueue, (i) => i.callback === queueCallback);
          pendingItem.timedOut = true;
          response.callback(new Error("timeout exceeded when trying to connect"));
        }, this.options.connectionTimeoutMillis);
        if (tid.unref) {
          tid.unref();
        }
        this._pendingQueue.push(pendingItem);
        return result;
      }
      this.newClient(new PendingItem(response.callback));
      return result;
    }
    newClient(pendingItem) {
      const client = new this.Client(this.options);
      this._clients.push(client);
      const idleListener = makeIdleListener(this, client);
      this.log("checking client timeout");
      let tid;
      let timeoutHit = false;
      if (this.options.connectionTimeoutMillis) {
        tid = setTimeout(() => {
          if (client.connection) {
            this.log("ending client due to timeout");
            timeoutHit = true;
            client.connection.stream.destroy();
          } else if (!client.isConnected()) {
            this.log("ending client due to timeout");
            timeoutHit = true;
            client.end();
          }
        }, this.options.connectionTimeoutMillis);
      }
      this.log("connecting new client");
      client.connect((err) => {
        if (tid) {
          clearTimeout(tid);
        }
        client.on("error", idleListener);
        if (err) {
          this.log("client failed to connect", err);
          this._clients = this._clients.filter((c) => c !== client);
          if (timeoutHit) {
            err = new Error("Connection terminated due to connection timeout", { cause: err });
          }
          this._pulseQueue();
          if (!pendingItem.timedOut) {
            pendingItem.callback(err, undefined, NOOP);
          }
        } else {
          this.log("new client connected");
          if (this.options.onConnect) {
            this._promiseTry(() => this.options.onConnect(client)).then(() => {
              this._afterConnect(client, pendingItem, idleListener);
            }, (hookErr) => {
              this._clients = this._clients.filter((c) => c !== client);
              client.end(() => {
                this._pulseQueue();
                if (!pendingItem.timedOut) {
                  pendingItem.callback(hookErr, undefined, NOOP);
                }
              });
            });
            return;
          }
          return this._afterConnect(client, pendingItem, idleListener);
        }
      });
    }
    _afterConnect(client, pendingItem, idleListener) {
      if (this.options.maxLifetimeSeconds !== 0) {
        const maxLifetimeTimeout = setTimeout(() => {
          this.log("ending client due to expired lifetime");
          this._expired.add(client);
          const idleIndex = this._idle.findIndex((idleItem) => idleItem.client === client);
          if (idleIndex !== -1) {
            this._acquireClient(client, new PendingItem((err, client, clientRelease) => clientRelease()), idleListener, false);
          }
        }, this.options.maxLifetimeSeconds * 1000);
        maxLifetimeTimeout.unref();
        client.once("end", () => clearTimeout(maxLifetimeTimeout));
      }
      return this._acquireClient(client, pendingItem, idleListener, true);
    }
    _acquireClient(client, pendingItem, idleListener, isNew) {
      if (isNew) {
        this.emit("connect", client);
      }
      this.emit("acquire", client);
      client.release = this._releaseOnce(client, idleListener);
      client.removeListener("error", idleListener);
      if (!pendingItem.timedOut) {
        if (isNew && this.options.verify) {
          this.options.verify(client, (err) => {
            if (err) {
              client.release(err);
              return pendingItem.callback(err, undefined, NOOP);
            }
            pendingItem.callback(undefined, client, client.release);
          });
        } else {
          pendingItem.callback(undefined, client, client.release);
        }
      } else {
        if (isNew && this.options.verify) {
          this.options.verify(client, client.release);
        } else {
          client.release();
        }
      }
    }
    _releaseOnce(client, idleListener) {
      let released = false;
      return (err) => {
        if (released) {
          throwOnDoubleRelease();
        }
        released = true;
        this._release(client, idleListener, err);
      };
    }
    _release(client, idleListener, err) {
      client.on("error", idleListener);
      client._poolUseCount = (client._poolUseCount || 0) + 1;
      this.emit("release", err, client);
      if (err || this.ending || !client._queryable || client._ending || client._poolUseCount >= this.options.maxUses) {
        if (client._poolUseCount >= this.options.maxUses) {
          this.log("remove expended client");
        }
        return this._remove(client, this._pulseQueue.bind(this));
      }
      const isExpired = this._expired.has(client);
      if (isExpired) {
        this.log("remove expired client");
        this._expired.delete(client);
        return this._remove(client, this._pulseQueue.bind(this));
      }
      let tid;
      if (this.options.idleTimeoutMillis && this._isAboveMin()) {
        tid = setTimeout(() => {
          if (this._isAboveMin()) {
            this.log("remove idle client");
            this._remove(client, this._pulseQueue.bind(this));
          }
        }, this.options.idleTimeoutMillis);
        if (this.options.allowExitOnIdle) {
          tid.unref();
        }
      }
      if (this.options.allowExitOnIdle) {
        client.unref();
      }
      this._idle.push(new IdleItem(client, idleListener, tid));
      this._pulseQueue();
    }
    query(text, values, cb) {
      if (typeof text === "function") {
        const response = promisify(this.Promise, text);
        setImmediate(function() {
          return response.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
        });
        return response.result;
      }
      if (typeof values === "function") {
        cb = values;
        values = undefined;
      }
      const response = promisify(this.Promise, cb);
      cb = response.callback;
      this.connect((err, client) => {
        if (err) {
          return cb(err);
        }
        let clientReleased = false;
        const onError = (err) => {
          if (clientReleased) {
            return;
          }
          clientReleased = true;
          client.release(err);
          cb(err);
        };
        client.once("error", onError);
        this.log("dispatching query");
        try {
          client.query(text, values, (err, res) => {
            this.log("query dispatched");
            client.removeListener("error", onError);
            if (clientReleased) {
              return;
            }
            clientReleased = true;
            client.release(err);
            if (err) {
              return cb(err);
            }
            return cb(undefined, res);
          });
        } catch (err) {
          client.release(err);
          return cb(err);
        }
      });
      return response.result;
    }
    end(cb) {
      this.log("ending");
      if (this.ending) {
        const err = new Error("Called end on pool more than once");
        return cb ? cb(err) : this.Promise.reject(err);
      }
      this.ending = true;
      const promised = promisify(this.Promise, cb);
      this._endCallback = promised.callback;
      this._pulseQueue();
      return promised.result;
    }
    get waitingCount() {
      return this._pendingQueue.length;
    }
    get idleCount() {
      return this._idle.length;
    }
    get expiredCount() {
      return this._clients.reduce((acc, client) => acc + (this._expired.has(client) ? 1 : 0), 0);
    }
    get totalCount() {
      return this._clients.length;
    }
  }
  module.exports = Pool;
});

// node_modules/pg/lib/native/query.js
var require_query2 = __commonJS(function(exports, module) {
  var EventEmitter = __require("events").EventEmitter;
  var util = __require("util");
  var utils = require_utils();
  var NativeQuery = module.exports = function(config, values, callback) {
    EventEmitter.call(this);
    config = utils.normalizeQueryConfig(config, values, callback);
    this.text = config.text;
    this.values = config.values;
    this.name = config.name;
    this.queryMode = config.queryMode;
    this.callback = config.callback;
    this.state = "new";
    this._arrayMode = config.rowMode === "array";
    this._emitRowEvents = false;
    this.on("newListener", function(event) {
      if (event === "row")
        this._emitRowEvents = true;
    }.bind(this));
  };
  util.inherits(NativeQuery, EventEmitter);
  var errorFieldMap = {
    sqlState: "code",
    statementPosition: "position",
    messagePrimary: "message",
    context: "where",
    schemaName: "schema",
    tableName: "table",
    columnName: "column",
    dataTypeName: "dataType",
    constraintName: "constraint",
    sourceFile: "file",
    sourceLine: "line",
    sourceFunction: "routine"
  };
  NativeQuery.prototype.handleError = function(err) {
    const fields = this.native && this.native.pq.resultErrorFields();
    if (fields) {
      for (const key in fields) {
        const normalizedFieldName = errorFieldMap[key] || key;
        err[normalizedFieldName] = fields[key];
      }
    }
    if (this.callback) {
      this.callback(err);
    } else {
      this.emit("error", err);
    }
    this.state = "error";
  };
  NativeQuery.prototype.then = function(onSuccess, onFailure) {
    return this._getPromise().then(onSuccess, onFailure);
  };
  NativeQuery.prototype.catch = function(callback) {
    return this._getPromise().catch(callback);
  };
  NativeQuery.prototype._getPromise = function() {
    if (this._promise)
      return this._promise;
    this._promise = new Promise(function(resolve, reject) {
      this._once("end", resolve);
      this._once("error", reject);
    }.bind(this));
    return this._promise;
  };
  NativeQuery.prototype.submit = function(client) {
    this.state = "running";
    const self = this;
    this.native = client.native;
    client.native.arrayMode = this._arrayMode;
    let after = function(err, rows, results) {
      client.native.arrayMode = false;
      setImmediate(function() {
        self.emit("_done");
      });
      if (err) {
        return self.handleError(err);
      }
      if (self._emitRowEvents) {
        if (results.length > 1) {
          rows.forEach((rowOfRows, i) => {
            rowOfRows.forEach((row) => {
              self.emit("row", row, results[i]);
            });
          });
        } else {
          rows.forEach(function(row) {
            self.emit("row", row, results);
          });
        }
      }
      self.state = "end";
      self.emit("end", results);
      if (self.callback) {
        self.callback(null, results);
      }
    };
    if (process.domain) {
      after = process.domain.bind(after);
    }
    if (this.name) {
      if (this.name.length > 63) {
        console.error("Warning! Postgres only supports 63 characters for query names.");
        console.error("You supplied %s (%s)", this.name, this.name.length);
        console.error("This can cause conflicts and silent errors executing queries");
      }
      const values = (this.values || []).map(utils.prepareValue);
      if (client.namedQueries[this.name]) {
        if (this.text && client.namedQueries[this.name] !== this.text) {
          const err = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
          return after(err);
        }
        return client.native.execute(this.name, values, after);
      }
      return client.native.prepare(this.name, this.text, values.length, function(err) {
        if (err)
          return after(err);
        client.namedQueries[self.name] = self.text;
        return self.native.execute(self.name, values, after);
      });
    } else if (this.values) {
      if (!Array.isArray(this.values)) {
        const err = new Error("Query values must be an array");
        return after(err);
      }
      const vals = this.values.map(utils.prepareValue);
      client.native.query(this.text, vals, after);
    } else if (this.queryMode === "extended") {
      client.native.query(this.text, [], after);
    } else {
      client.native.query(this.text, after);
    }
  };
});

// node_modules/pg/lib/native/client.js
var require_client2 = __commonJS(function(exports, module) {
  var nodeUtils = __require("util");
  var Native;
  try {
    Native = (()=>{throw new Error("Cannot require module "+"pg-native");})();
  } catch (e) {
    throw e;
  }
  var TypeOverrides = require_type_overrides();
  var EventEmitter = __require("events").EventEmitter;
  var util = __require("util");
  var ConnectionParameters = require_connection_parameters();
  var NativeQuery = require_query2();
  var queryQueueLengthDeprecationNotice = nodeUtils.deprecate(() => {}, "Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");
  var Client = module.exports = function(config) {
    EventEmitter.call(this);
    config = config || {};
    this._Promise = config.Promise || global.Promise;
    this._types = new TypeOverrides(config.types);
    this.native = new Native({
      types: this._types
    });
    this._queryQueue = [];
    this._ending = false;
    this._connecting = false;
    this._connected = false;
    this._queryable = true;
    this.pipeline = Boolean(config.pipeline);
    this._pipelineInFlight = false;
    const cp = this.connectionParameters = new ConnectionParameters(config);
    if (config.nativeConnectionString)
      cp.nativeConnectionString = config.nativeConnectionString;
    this.user = cp.user;
    Object.defineProperty(this, "password", {
      configurable: true,
      enumerable: false,
      writable: true,
      value: cp.password
    });
    this.database = cp.database;
    this.host = cp.host;
    this.port = cp.port;
    this.namedQueries = {};
  };
  Client.Query = NativeQuery;
  util.inherits(Client, EventEmitter);
  Client.prototype._errorAllQueries = function(err) {
    const enqueueError = (query) => {
      process.nextTick(() => {
        query.native = this.native;
        query.handleError(err);
      });
    };
    if (this._hasActiveQuery()) {
      enqueueError(this._activeQuery);
      this._activeQuery = null;
    }
    this._queryQueue.forEach(enqueueError);
    this._queryQueue.length = 0;
  };
  Client.prototype._connect = function(cb) {
    const self = this;
    if (this._connecting) {
      process.nextTick(() => cb(new Error("Client has already been connected. You cannot reuse a client.")));
      return;
    }
    this._connecting = true;
    this.connectionParameters.getLibpqConnectionString(function(err, conString) {
      if (self.connectionParameters.nativeConnectionString)
        conString = self.connectionParameters.nativeConnectionString;
      if (err)
        return cb(err);
      self.native.connect(conString, function(err) {
        if (err) {
          self.native.end();
          return cb(err);
        }
        self._connected = true;
        self.native.on("error", function(err) {
          self._queryable = false;
          self._errorAllQueries(err);
          self.emit("error", err);
        });
        self.native.on("notification", function(msg) {
          self.emit("notification", {
            channel: msg.relname,
            payload: msg.extra
          });
        });
        self.emit("connect");
        self._pulseQueryQueue(true);
        cb(null, this);
      });
    });
  };
  Client.prototype.connect = function(callback) {
    if (callback) {
      this._connect(callback);
      return;
    }
    return new this._Promise((resolve, reject) => {
      this._connect((error) => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  };
  Client.prototype.query = function(config, values, callback) {
    let query;
    let result;
    let readTimeout;
    let readTimeoutTimer;
    let queryCallback;
    if (config === null || config === undefined) {
      throw new TypeError("Client was passed a null or undefined query");
    } else if (typeof config.submit === "function") {
      readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
      result = query = config;
      if (typeof values === "function") {
        config.callback = values;
      }
    } else {
      readTimeout = config.query_timeout || this.connectionParameters.query_timeout;
      query = new NativeQuery(config, values, callback);
      if (!query.callback) {
        let resolveOut, rejectOut;
        result = new this._Promise((resolve, reject) => {
          resolveOut = resolve;
          rejectOut = reject;
        }).catch((err) => {
          Error.captureStackTrace(err);
          throw err;
        });
        query.callback = (err, res) => err ? rejectOut(err) : resolveOut(res);
      }
    }
    if (readTimeout) {
      queryCallback = query.callback || (() => {});
      readTimeoutTimer = setTimeout(() => {
        const error = new Error("Query read timeout");
        process.nextTick(() => {
          query.handleError(error, this.connection);
        });
        queryCallback(error);
        query.callback = () => {};
        const index = this._queryQueue.indexOf(query);
        if (index > -1) {
          this._queryQueue.splice(index, 1);
        }
        this._pulseQueryQueue();
      }, readTimeout);
      query.callback = (err, res) => {
        clearTimeout(readTimeoutTimer);
        queryCallback(err, res);
      };
    }
    if (!this._queryable) {
      query.native = this.native;
      process.nextTick(() => {
        query.handleError(new Error("Client has encountered a connection error and is not queryable"));
      });
      return result;
    }
    if (this._ending) {
      query.native = this.native;
      process.nextTick(() => {
        query.handleError(new Error("Client was closed and is not queryable"));
      });
      return result;
    }
    if (this._queryQueue.length > 0 && !this.pipeline) {
      queryQueueLengthDeprecationNotice();
    }
    this._queryQueue.push(query);
    this._pulseQueryQueue();
    return result;
  };
  Client.prototype.end = function(cb) {
    const self = this;
    this._ending = true;
    if (this._connecting && !this._connected) {
      this.once("connect", () => {
        this.end(() => {});
      });
    }
    let result;
    if (!cb) {
      result = new this._Promise(function(resolve, reject) {
        cb = (err) => err ? reject(err) : resolve();
      });
    }
    const doEnd = function() {
      self.native.end(function() {
        self._connected = false;
        self._errorAllQueries(new Error("Connection terminated"));
        process.nextTick(() => {
          self.emit("end");
          if (cb)
            cb();
        });
      });
    };
    if (this.pipeline && (this._pipelineInFlight || this._queryQueue.length > 0)) {
      this.once("drain", doEnd);
    } else {
      doEnd();
    }
    return result;
  };
  Client.prototype._hasActiveQuery = function() {
    return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
  };
  Client.prototype._pulseQueryQueue = function(initialConnection) {
    if (!this._connected) {
      return;
    }
    if (this.pipeline && !initialConnection) {
      return this._pulsePipelinedQueryQueue();
    }
    if (this._hasActiveQuery()) {
      return;
    }
    const query = this._queryQueue.shift();
    if (!query) {
      if (!initialConnection) {
        this.emit("drain");
      }
      return;
    }
    this._activeQuery = query;
    query.submit(this);
    const self = this;
    query.once("_done", function() {
      self._pulseQueryQueue();
    });
  };
  Client.prototype._pulsePipelinedQueryQueue = function() {
    if (!this._connected || this._pipelineInFlight) {
      return;
    }
    if (this._queryQueue.length === 0) {
      if (this.hasExecuted) {
        this.emit("drain");
      }
      return;
    }
    this._pipelineInFlight = true;
    const self = this;
    const queries = [];
    const nativeQueries = [];
    const utils = require_utils();
    while (this._queryQueue.length > 0) {
      const query = this._queryQueue.shift();
      this.hasExecuted = true;
      nativeQueries.push(query);
      const values = query.values ? query.values.map(utils.prepareValue) : null;
      const pipelineEntry = { text: query.text, name: query.name };
      if (values) {
        pipelineEntry.values = values;
      }
      if (query.name && this.namedQueries[query.name]) {
        pipelineEntry._alreadyPrepared = true;
      }
      queries.push(pipelineEntry);
    }
    this.native.pipeline(queries, function(err, results) {
      self._pipelineInFlight = false;
      if (err) {
        for (let i = 0;i < nativeQueries.length; i++) {
          const q = nativeQueries[i];
          q.native = self.native;
          q.handleError(err);
        }
        self._pulsePipelinedQueryQueue();
        return;
      }
      for (let i = 0;i < nativeQueries.length; i++) {
        const q = nativeQueries[i];
        const r = results[i];
        q.native = self.native;
        if (r.err) {
          q.handleError(r.err);
        } else {
          if (q.name) {
            self.namedQueries[q.name] = q.text;
          }
          q.state = "end";
          q.emit("end", r.result);
          if (q.callback) {
            q.callback(null, r.result);
          }
        }
        setImmediate(function() {
          q.emit("_done");
        });
      }
      self._pulsePipelinedQueryQueue();
    });
  };
  Client.prototype.cancel = function(query) {
    if (this._activeQuery === query) {
      this.native.cancel(function() {});
    } else if (this._queryQueue.indexOf(query) !== -1) {
      this._queryQueue.splice(this._queryQueue.indexOf(query), 1);
    }
  };
  Client.prototype.ref = function() {};
  Client.prototype.unref = function() {};
  Client.prototype.setTypeParser = function(oid, format, parseFn) {
    return this._types.setTypeParser(oid, format, parseFn);
  };
  Client.prototype.getTypeParser = function(oid, format) {
    return this._types.getTypeParser(oid, format);
  };
  Client.prototype.isConnected = function() {
    return this._connected;
  };
  Client.prototype.getTransactionStatus = function() {
    return this.native.getTransactionStatus();
  };
});

// node_modules/pg/lib/index.js
var require_lib2 = __commonJS(function(exports, module) {
  var Client = require_client();
  var defaults = require_defaults();
  var Connection = require_connection();
  var Result = require_result();
  var utils = require_utils();
  var Pool = require_pg_pool();
  var TypeOverrides = require_type_overrides();
  var { DatabaseError } = require_dist();
  var { escapeIdentifier, escapeLiteral } = require_utils();
  var poolFactory = (Client) => {
    return class BoundPool extends Pool {
      constructor(options) {
        super(options, Client);
      }
    };
  };
  var PG = function(clientConstructor) {
    this.defaults = defaults;
    this.Client = clientConstructor;
    this.Query = this.Client.Query;
    this.Pool = poolFactory(this.Client);
    this._pools = [];
    this.Connection = Connection;
    this.types = require_pg_types();
    this.DatabaseError = DatabaseError;
    this.TypeOverrides = TypeOverrides;
    this.escapeIdentifier = escapeIdentifier;
    this.escapeLiteral = escapeLiteral;
    this.Result = Result;
    this.utils = utils;
  };
  var clientConstructor = Client;
  var forceNative = false;
  try {
    forceNative = !!process.env.NODE_PG_FORCE_NATIVE;
  } catch {}
  if (forceNative) {
    clientConstructor = require_client2();
  }
  module.exports = new PG(clientConstructor);
  Object.defineProperty(module.exports, "native", {
    configurable: true,
    enumerable: false,
    get() {
      let native = null;
      try {
        native = new PG(require_client2());
      } catch (err) {
        if (err.code !== "MODULE_NOT_FOUND") {
          throw err;
        }
      }
      Object.defineProperty(module.exports, "native", {
        value: native
      });
      return native;
    }
  });
});

// src/worker.ts
var import_config2 = __toESM(require_config());
// node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object")
    return false;
  if (value instanceof type)
    return true;
  if (!Object.prototype.hasOwnProperty.call(type, entityKind))
    throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
  let cls = Object.getPrototypeOf(value)?.constructor;
  if (cls)
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind])
        return true;
      cls = Object.getPrototypeOf(cls);
    }
  return false;
}

// node_modules/drizzle-orm/column-common.js
var OriginalColumn = Symbol.for("drizzle:OriginalColumn");

// node_modules/drizzle-orm/column.js
var noop = (v) => v;
noop.isNoop = true;
var Column = class {
  static [entityKind] = "Column";
  codec;
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = undefined;
  generated = undefined;
  generatedIdentity = undefined;
  length;
  isLengthExact;
  isAlias;
  config;
  table;
  onInit() {}
  constructor(table, config) {
    this.config = config;
    this.onInit();
    this.table = table;
    this.name = config.name;
    this.isAlias = false;
    this.keyAsName = config.keyAsName;
    this.notNull = config.notNull;
    this.default = config.default;
    this.defaultFn = config.defaultFn;
    this.onUpdateFn = config.onUpdateFn;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.isUnique = config.isUnique;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
    this.dataType = config.dataType;
    this.columnType = config.columnType;
    this.generated = config.generated;
    this.generatedIdentity = config.generatedIdentity;
    this.length = config["length"];
    this.isLengthExact = config["isLengthExact"];
  }
  mapFromDriverValue = noop;
  mapToDriverValue = noop;
  postBuild() {
    return this;
  }
  shouldDisableInsert() {
    return this.config.generated !== undefined && this.config.generated.type !== "byDefault";
  }
  [OriginalColumn]() {
    return this;
  }
};

// node_modules/drizzle-orm/table.utils.js
var TableName = Symbol.for("drizzle:Name");

// node_modules/drizzle-orm/table.js
var TableSchema = Symbol.for("drizzle:Schema");
var TableColumns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var Table = class {
  static [entityKind] = "Table";
  static Symbol = {
    Name: TableName,
    Schema: TableSchema,
    OriginalName,
    Columns: TableColumns,
    ExtraConfigColumns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  [TableName];
  [OriginalName];
  [TableSchema];
  [TableColumns];
  [ExtraConfigColumns];
  [BaseName];
  [IsAlias] = false;
  [IsDrizzleTable] = true;
  [ExtraConfigBuilder] = undefined;
  constructor(name, schema, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[TableSchema] = schema;
    this[BaseName] = baseName;
  }
};
function getTableName(table) {
  return table[TableName];
}

// node_modules/drizzle-orm/subquery.js
var Subquery = class {
  static [entityKind] = "Subquery";
  constructor(sql, fields, alias, isWith = false, usedTables = []) {
    this._ = {
      brand: "Subquery",
      sql,
      selectedFields: fields,
      alias,
      isWith,
      usedTables
    };
  }
};
var WithSubquery = class extends Subquery {
  static [entityKind] = "WithSubquery";
};

// node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}

// node_modules/drizzle-orm/tracing.js
var hasTelemetry = false;
var tracer = { startActiveSpan(name, fn) {
  return fn();
} };

// node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
  return value !== null && value !== undefined && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = {
    sql: "",
    params: []
  };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
  }
  return result;
}
function _mergeQueries(queries) {
  const result = {
    sql: "",
    params: []
  };
  const sqls = [];
  for (const query of queries) {
    sqls.push(query.sql);
    result.params.push(...query.params);
  }
  result._sql = Object.assign(sqls, { raw: sqls });
  return result;
}
var StringChunk = class {
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
var SQL = class SQL {
  static [entityKind] = "SQL";
  decoder = noopDecoder;
  shouldInlineParams = false;
  usedTables = [];
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
    for (const chunk of queryChunks)
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        this.usedTables.push(schemaName === undefined ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]);
      }
  }
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const { escapeName, escapeParam, codecs, inlineParams, paramStartIndex, invokeSource } = config;
    const mappedChunks = chunks.map((chunk) => {
      if (is(chunk, StringChunk))
        return {
          sql: chunk.value.join(""),
          params: []
        };
      if (is(chunk, Name))
        return {
          sql: escapeName(chunk.value),
          params: []
        };
      if (chunk === undefined)
        return {
          sql: "",
          params: []
        };
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1)
            result.push(new StringChunk(", "));
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config);
      }
      if (is(chunk, SQL))
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        if (invokeSource === "mssql-view-with-schemabinding")
          return {
            sql: (schemaName === undefined ? escapeName("dbo") : escapeName(schemaName)) + "." + escapeName(tableName),
            params: []
          };
        return {
          sql: schemaName === undefined || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = chunk.name;
        if (_config.invokeSource === "indexes")
          return {
            sql: escapeName(columnName),
            params: []
          };
        const schemaName = invokeSource === "mssql-check" ? undefined : chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.isAlias ? escapeName(chunk.name) : chunk.table[IsAlias] || schemaName === undefined ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === undefined || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, SQL))
          return this.buildQueryFromSourceParams([chunk.value], config);
        const useCodecs = codecs && is(chunk.encoder, Column);
        if (is(chunk.value, Placeholder)) {
          const escaped = escapeParam(paramStartIndex.value++, chunk);
          chunk.codec = useCodecs ? (value) => codecs.apply(chunk.encoder, "normalizeParam", value) : undefined;
          return {
            sql: useCodecs ? codecs.apply(chunk.encoder, "castParam", escaped) : escaped,
            params: [chunk]
          };
        }
        let mappedValue;
        if (chunk.value === null)
          mappedValue = chunk.value;
        else {
          mappedValue = chunk.encoder.mapToDriverValue.isNoop ? chunk.value : chunk.encoder.mapToDriverValue(chunk.value);
          if (is(mappedValue, SQL))
            return this.buildQueryFromSourceParams([mappedValue], config);
          if (useCodecs)
            mappedValue = codecs.apply(chunk.encoder, "normalizeParam", mappedValue);
        }
        if (inlineParams)
          return {
            sql: this.mapInlineParam(mappedValue, config),
            params: []
          };
        const escaped = escapeParam(paramStartIndex.value++, mappedValue);
        return {
          sql: useCodecs ? codecs.apply(chunk.encoder, "castParam", escaped) : escaped,
          params: [mappedValue]
        };
      }
      if (is(chunk, Placeholder))
        return {
          sql: escapeParam(paramStartIndex.value++, chunk),
          params: [chunk]
        };
      if (is(chunk, SQL.Aliased) && chunk.fieldAlias !== undefined)
        return {
          sql: (chunk.origin !== undefined ? escapeName(chunk.origin) + "." : "") + escapeName(chunk.fieldAlias),
          params: []
        };
      if (is(chunk, Subquery)) {
        if (chunk._.isWith)
          return {
            sql: escapeName(chunk._.alias),
            params: []
          };
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config);
      }
      if (typeof chunk === "function" && "enumName" in chunk) {
        if ("schema" in chunk && chunk.schema)
          return {
            sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName),
            params: []
          };
        return {
          sql: escapeName(chunk.enumName),
          params: []
        };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.())
          return this.buildQueryFromSourceParams([chunk.getSQL()], config);
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config);
      }
      if (inlineParams)
        return {
          sql: this.mapInlineParam(chunk, config),
          params: []
        };
      return {
        sql: escapeParam(paramStartIndex.value++, chunk),
        params: [chunk]
      };
    });
    if (_config.tagged)
      return _mergeQueries(mappedChunks);
    return mergeQueries(mappedChunks);
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null)
      return "null";
    if (typeof chunk === "number" || typeof chunk === "boolean" || typeof chunk === "bigint")
      return chunk.toString();
    if (typeof chunk === "string")
      return escapeString(chunk);
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]")
        return escapeString(JSON.stringify(chunk));
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === undefined)
      return this;
    return new SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  nullable() {
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  if(condition) {
    return condition ? this : undefined;
  }
};
var Name = class {
  static [entityKind] = "Name";
  brand;
  constructor(value) {
    this.value = value;
  }
  getSQL() {
    return new SQL([this]);
  }
};
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
var noopDecoder = { mapFromDriverValue: (value) => value };
noopDecoder.mapFromDriverValue.isNoop = true;
var noopEncoder = { mapToDriverValue: (value) => value };
noopEncoder.mapToDriverValue.isNoop = true;
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var Param = class {
  static [entityKind] = "Param";
  brand;
  constructor(value, encoder = noopEncoder, codec) {
    this.value = value;
    this.encoder = encoder;
    this.codec = codec;
  }
  getSQL() {
    return new SQL([this]);
  }
};
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "")
    queryChunks.push(new StringChunk(strings[0]));
  for (const [paramIndex, param] of params.entries())
    queryChunks.push(param, new StringChunk(strings[paramIndex + 1]));
  return new SQL(queryChunks);
}
(function(_sql) {
  function empty() {
    return new SQL([]);
  }
  _sql.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  _sql.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  _sql.raw = raw;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== undefined)
        result.push(separator);
      result.push(chunk);
    }
    return new SQL(result);
  }
  _sql.join = join;
  function identifier(value) {
    return new Name(value);
  }
  _sql.identifier = identifier;
  function placeholder(name) {
    return new Placeholder(name);
  }
  _sql.placeholder = placeholder;
  function param(value, encoder) {
    return new Param(value, encoder);
  }
  _sql.param = param;
  function comment(input) {
    const encoded = sqlCommenter(input);
    if (!encoded.length)
      return;
    return sql.raw(encoded);
  }
  _sql.comment = comment;
})(sql || (sql = {}));
function sqlCommenter(input) {
  const encoded = sqlCommenter.encodeInput(input);
  if (!encoded.length)
    return "";
  return `/*${encoded}*/`;
}
(function(_sqlCommenter) {
  function merge(input1, input2) {
    let encoded;
    if (typeof input1 === "object" && typeof input2 === "object")
      encoded = encodeInput({
        ...input1,
        ...input2
      });
    else if (input1 && input2)
      encoded = [encodeInput(input1), encodeInput(input2)].filter((i) => i.length).join(",");
    else if (input2)
      encoded = encodeInput(input2);
    else if (input1)
      encoded = encodeInput(input1);
    else
      return "";
    if (!encoded.length)
      return "";
    return `/*${encoded}*/`;
  }
  _sqlCommenter.merge = merge;
  function encodeInput(input) {
    if (typeof input === "string") {
      if (!input.length)
        return input;
      return sanitizeStringInput(input);
    }
    const parts = [];
    for (const [key, value] of Object.entries(input)) {
      if (value === null || value === undefined || value === "")
        continue;
      const encodedKey = sanitizeObjectElement(key);
      const encodedValue = sanitizeObjectElement(String(value));
      parts.push(`${encodedKey}='${encodedValue}'`);
    }
    if (!parts.length)
      return "";
    return parts.sort().join(",");
  }
  _sqlCommenter.encodeInput = encodeInput;
  function sanitizeObjectElement(key) {
    return encodeURIComponent(key).replace(/'/g, `\\'`);
  }
  _sqlCommenter.sanitizeObjectElement = sanitizeObjectElement;
  function sanitizeStringInput(input) {
    return input.replace(/\/\*/g, "/ *").replace(/\*\//g, "* /");
  }
  _sqlCommenter.sanitizeStringInput = sanitizeStringInput;
})(sqlCommenter || (sqlCommenter = {}));
(function(_SQL) {

  class Aliased {
    static [entityKind] = "SQL.Aliased";
    isSelectionField = false;
    origin;
    constructor(sql, fieldAlias) {
      this.sql = sql;
      this.fieldAlias = fieldAlias;
    }
    getSQL() {
      return this.sql;
    }
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  _SQL.Aliased = Aliased;
})(SQL || (SQL = {}));
var Placeholder = class {
  static [entityKind] = "Placeholder";
  constructor(name) {
    this.name = name;
  }
  getSQL() {
    return new SQL([this]);
  }
};
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values))
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      return values[p.name];
    }
    if (is(p, Param) && is(p.value, Placeholder)) {
      if (!(p.value.name in values))
        throw new Error(`No value for placeholder "${p.value.name}" was provided`);
      const value = values[p.value.name];
      if (value === null)
        return value;
      const mapped = p.encoder.mapToDriverValue.isNoop ? value : p.encoder.mapToDriverValue(value);
      return p.codec ? p.codec(mapped) : mapped;
    }
    return p;
  });
}
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var View = class {
  static [entityKind] = "View";
  [ViewBaseConfig];
  [IsDrizzleView] = true;
  get [TableName]() {
    return this[ViewBaseConfig].name;
  }
  get [TableSchema]() {
    return this[ViewBaseConfig].schema;
  }
  get [IsAlias]() {
    return this[ViewBaseConfig].isAlias;
  }
  get [OriginalName]() {
    return this[ViewBaseConfig].originalName;
  }
  get [TableColumns]() {
    return this[ViewBaseConfig].selectedFields;
  }
  constructor({ name, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name,
      originalName: name,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
};
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};
// node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View))
    return new Param(value, column);
  return value;
}
var eq = (left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
};
var ne = (left, right) => {
  return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter((c) => c !== undefined);
  if (conditions.length === 0)
    return;
  if (conditions.length === 1)
    return new SQL(conditions);
  return new SQL([
    new StringChunk("("),
    sql.join(conditions.map((c) => sql`(${c})`), new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter((c) => c !== undefined);
  if (conditions.length === 0)
    return;
  if (conditions.length === 1)
    return new SQL(conditions);
  return new SQL([
    new StringChunk("("),
    sql.join(conditions.map((c) => sql`(${c})`), new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return is(condition, SQL) ? sql`not (${condition})` : sql`not ${condition}`;
}
var gt = (left, right) => {
  return sql`${left} > ${bindIfParam(right, left)}`;
};
var gte = (left, right) => {
  return sql`${left} >= ${bindIfParam(right, left)}`;
};
var lt = (left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
};
var lte = (left, right) => {
  return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0)
      return sql`false`;
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0)
      return sql`true`;
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return sql`(${value} is null)`;
}
function isNotNull(value) {
  return sql`(${value} is not null)`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}
function arrayContains(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0)
      throw new Error("arrayContains requires at least one value");
    const par = bindIfParam(values, column);
    return sql`${column} @> ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
  }
  return sql`${column} @> ${bindIfParam(values, column)}`;
}
function arrayContained(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0)
      throw new Error("arrayContained requires at least one value");
    const par = bindIfParam(values, column);
    return sql`${column} <@ ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
  }
  return sql`${column} <@ ${bindIfParam(values, column)}`;
}
function arrayOverlaps(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0)
      throw new Error("arrayOverlaps requires at least one value");
    const par = bindIfParam(values, column);
    return sql`${column} && ${sql`${Array.isArray(par) ? new Param(par) : par}`}`;
  }
  return sql`${column} && ${bindIfParam(values, column)}`;
}

// node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}
// src/db/index.ts
var import_config = __toESM(require_config());
// node_modules/drizzle-orm/pg-core/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom;i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"')
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    if (inQuotes)
      continue;
    if (char === "," || char === "}")
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom)
        result.push("");
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value, startFrom] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value);
      i = startFrom;
      continue;
    }
    if (char === "}")
      return [result, i + 1];
    if (char === "{") {
      const [value, startFrom] = parsePgNestedArray(arrayString, i + 1);
      result.push(value);
      i = startFrom;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item))
      return makePgArray(item);
    if (typeof item === "string")
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
    return `${item}`;
  }).join(",")}}`;
}

// node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.js
function hexToBytes(hex) {
  const bytes = [];
  for (let c = 0;c < hex.length; c += 2)
    bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
  return new Uint8Array(bytes);
}
function bytesToFloat64(bytes, offset) {
  const buffer = /* @__PURE__ */ new ArrayBuffer(8);
  const view = new DataView(buffer);
  for (let i = 0;i < 8; i++)
    view.setUint8(i, bytes[offset + i]);
  return view.getFloat64(0, true);
}
function parseEWKB(hex) {
  const bytes = hexToBytes(hex);
  let offset = 0;
  const byteOrder = bytes[offset];
  offset += 1;
  const view = new DataView(bytes.buffer);
  const geomType = view.getUint32(offset, byteOrder === 1);
  offset += 4;
  let srid;
  if (geomType & 536870912) {
    srid = view.getUint32(offset, byteOrder === 1);
    offset += 4;
  }
  if ((geomType & 65535) === 1) {
    const x = bytesToFloat64(bytes, offset);
    offset += 8;
    const y = bytesToFloat64(bytes, offset);
    offset += 8;
    return {
      srid,
      point: [x, y]
    };
  }
  throw new Error("Unsupported geometry type");
}

// node_modules/drizzle-orm/codecs.js
var noopCodecs = {};
var arrayToItemTypeCodecNameMap = {
  cast: "cast",
  castArray: "cast",
  castInJson: "castInJson",
  castArrayInJson: "castInJson",
  castParam: "castParam",
  castArrayParam: "castParam",
  normalize: "normalize",
  normalizeArray: "normalize",
  normalizeInJson: "normalizeInJson",
  normalizeArrayInJson: "normalizeInJson",
  normalizeParam: "normalizeParam",
  normalizeParamArray: "normalizeParam"
};
var itemToArrayTypeCodecNameMap = {
  cast: "castArray",
  castArray: "castArray",
  castInJson: "castArrayInJson",
  castArrayInJson: "castArrayInJson",
  castParam: "castArrayParam",
  castArrayParam: "castArrayParam",
  normalize: "normalizeArray",
  normalizeArray: "normalizeArray",
  normalizeInJson: "normalizeArrayInJson",
  normalizeArrayInJson: "normalizeArrayInJson",
  normalizeParam: "normalizeParamArray",
  normalizeParamArray: "normalizeParamArray"
};
var CodecsCollection = class {
  static [entityKind] = "CodecsCollection";
  constructor(resolveTypes, codecs = noopCodecs) {
    this.resolveTypes = resolveTypes;
    this.codecs = codecs;
  }
  get(column, type, override) {
    const sqlType = override ?? column.codec;
    if (!sqlType)
      return;
    const codecType = column.dimensions ? itemToArrayTypeCodecNameMap[type] : arrayToItemTypeCodecNameMap[type];
    return this.codecs[sqlType]?.[codecType];
  }
  apply(column, type, value, override) {
    const sqlType = override ?? column.codec;
    if (!sqlType)
      return value;
    const codecType = column.dimensions ? itemToArrayTypeCodecNameMap[type] : arrayToItemTypeCodecNameMap[type];
    const codec = this.codecs[sqlType]?.[codecType];
    if (!codec)
      return value;
    if (codecType === "castParam" || codecType === "castArrayParam")
      return codec(value, column, column.dimensions);
    return codec(value, column.dimensions);
  }
};
function refineCodecs(source, extension = {}) {
  const keys = new Set([...Object.keys(source), ...Object.keys(extension)]).values();
  const result = {};
  for (const k of keys) {
    if (!(k in extension)) {
      result[k] = source[k] ? { ...source[k] } : undefined;
      continue;
    }
    if (!(k in source) || extension[k] === undefined) {
      result[k] = extension[k] ? { ...extension[k] } : undefined;
      continue;
    }
    const innerKeys = new Set([...Object.keys(extension[k]), ...Object.keys(source[k] ?? {})]).values();
    result[k] = {};
    for (const ik of innerKeys)
      result[k][ik] = ik in extension[k] ? extension[k][ik] : source[k]?.[ik];
  }
  return result;
}

// node_modules/drizzle-orm/pg-core/codecs.js
var PG_ALIAS_TO_TYPE_MAP = {
  int2: "smallint",
  integer: "int",
  int4: "int",
  int8: "bigint",
  decimal: "numeric",
  real: "float4",
  double: "float8",
  "double precision": "float8",
  serial2: "smallserial",
  serial4: "serial",
  serial8: "bigserial",
  character: "char",
  "character varying": "varchar",
  "time with time zone": "timetz",
  "time without time zone": "time",
  "timestamp with time zone": "timestamptz",
  "timestamp without time zone": "timestamp",
  boolean: "bool",
  "bit varying": "varbit"
};
function resolvePgTypeAlias(type) {
  return PG_ALIAS_TO_TYPE_MAP[type] ?? type;
}
var unionsTypeTable = {
  smallint: {
    smallint: "smallint",
    int: "int",
    bigint: "bigint:number",
    "bigint:number": "bigint:number",
    "bigint:string": "bigint:number",
    numeric: "numeric:number",
    "numeric:number": "numeric:number",
    "numeric:bigint": "numeric:number",
    float4: "float4",
    float8: "float8",
    smallserial: "smallint",
    serial: "int",
    bigserial: "bigint:number",
    "bigserial:number": "bigint:number",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  int: {
    smallint: "int",
    int: "int",
    bigint: "bigint:number",
    "bigint:number": "bigint:number",
    "bigint:string": "bigint:number",
    numeric: "numeric:number",
    "numeric:number": "numeric:number",
    "numeric:bigint": "numeric:number",
    float4: "float4",
    float8: "float8",
    smallserial: "int",
    serial: "int",
    bigserial: "bigint:number",
    "bigserial:number": "bigint:number",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  bigint: {
    smallint: "bigint",
    int: "bigint",
    bigint: "bigint",
    "bigint:number": "bigint",
    "bigint:string": "bigint",
    numeric: "numeric:bigint",
    "numeric:number": "numeric:bigint",
    "numeric:bigint": "numeric:bigint",
    float4: "float4",
    float8: "float8",
    smallserial: "bigint",
    serial: "bigint",
    bigserial: "bigint",
    "bigserial:number": "bigint",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  "bigint:number": {
    smallint: "bigint:number",
    int: "bigint:number",
    bigint: "bigint:number",
    "bigint:number": "bigint:number",
    "bigint:string": "bigint:number",
    numeric: "numeric:number",
    "numeric:number": "numeric:number",
    "numeric:bigint": "numeric:number",
    float4: "float4",
    float8: "float8",
    smallserial: "bigint:number",
    serial: "bigint:number",
    bigserial: "bigint:number",
    "bigserial:number": "bigint:number",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  "bigint:string": {
    smallint: "bigint:string",
    int: "bigint:string",
    bigint: "bigint:string",
    "bigint:number": "bigint:string",
    "bigint:string": "bigint:string",
    numeric: "numeric",
    "numeric:number": "numeric",
    "numeric:bigint": "numeric",
    float4: "float4",
    float8: "float8",
    smallserial: "bigint:string",
    serial: "bigint:string",
    bigserial: "bigint:string",
    "bigserial:number": "bigint:string",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  numeric: {
    smallint: "numeric",
    int: "numeric",
    bigint: "numeric",
    "bigint:number": "numeric",
    "bigint:string": "numeric",
    numeric: "numeric",
    "numeric:number": "numeric",
    "numeric:bigint": "numeric",
    float4: "float4",
    float8: "float8",
    smallserial: "numeric",
    serial: "numeric",
    bigserial: "numeric",
    "bigserial:number": "numeric"
  },
  "numeric:number": {
    smallint: "numeric:number",
    int: "numeric:number",
    bigint: "numeric:number",
    "bigint:number": "numeric:number",
    "bigint:string": "numeric:number",
    numeric: "numeric:number",
    "numeric:number": "numeric:number",
    "numeric:bigint": "numeric:number",
    float4: "float4",
    float8: "float8",
    smallserial: "numeric:number",
    serial: "numeric:number",
    bigserial: "numeric:number",
    "bigserial:number": "numeric:number"
  },
  "numeric:bigint": {
    smallint: "numeric:bigint",
    int: "numeric:bigint",
    bigint: "numeric:bigint",
    "bigint:number": "numeric:bigint",
    "bigint:string": "numeric:bigint",
    numeric: "numeric:bigint",
    "numeric:number": "numeric:bigint",
    "numeric:bigint": "numeric:bigint",
    float4: "float4",
    float8: "float8",
    smallserial: "numeric:bigint",
    serial: "numeric:bigint",
    bigserial: "numeric:bigint",
    "bigserial:number": "numeric:bigint"
  },
  float4: {
    smallint: "float4",
    int: "float4",
    bigint: "float4",
    "bigint:number": "float4",
    "bigint:string": "float4",
    numeric: "float4",
    "numeric:number": "float4",
    "numeric:bigint": "float4",
    float4: "float4",
    float8: "float8",
    smallserial: "float4",
    serial: "float4",
    bigserial: "float4",
    "bigserial:number": "float4"
  },
  float8: {
    smallint: "float8",
    int: "float8",
    bigint: "float8",
    "bigint:number": "float8",
    "bigint:string": "float8",
    numeric: "float8",
    "numeric:number": "float8",
    "numeric:bigint": "float8",
    float4: "float8",
    float8: "float8",
    smallserial: "float8",
    serial: "float8",
    bigserial: "float8",
    "bigserial:number": "float8"
  },
  money: { money: "money" },
  smallserial: {
    smallint: "smallint",
    int: "int",
    bigint: "bigint:number",
    "bigint:number": "bigint:number",
    "bigint:string": "bigint:number",
    numeric: "numeric:number",
    "numeric:number": "numeric:number",
    "numeric:bigint": "numeric:number",
    float4: "float4",
    float8: "float8",
    smallserial: "smallint",
    serial: "int",
    bigserial: "bigint:number",
    "bigserial:number": "bigint:number",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  serial: {
    smallint: "int",
    int: "int",
    bigint: "bigint:number",
    "bigint:number": "bigint:number",
    "bigint:string": "bigint:number",
    numeric: "numeric:number",
    "numeric:number": "numeric:number",
    "numeric:bigint": "numeric:number",
    float4: "float4",
    float8: "float8",
    smallserial: "int",
    serial: "int",
    bigserial: "bigint:number",
    "bigserial:number": "bigint:number",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  bigserial: {
    smallint: "bigint",
    int: "bigint",
    bigint: "bigint",
    "bigint:number": "bigint",
    "bigint:string": "bigint",
    numeric: "numeric:bigint",
    "numeric:number": "numeric:bigint",
    "numeric:bigint": "numeric:bigint",
    float4: "float4",
    float8: "float8",
    smallserial: "bigint",
    serial: "bigint",
    bigserial: "bigint",
    "bigserial:number": "bigint",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  "bigserial:number": {
    smallint: "bigint:number",
    int: "bigint:number",
    bigint: "bigint:number",
    "bigint:number": "bigint:number",
    "bigint:string": "bigint:number",
    numeric: "numeric:number",
    "numeric:number": "numeric:number",
    "numeric:bigint": "numeric:number",
    float4: "float4",
    float8: "float8",
    smallserial: "bigint:number",
    serial: "bigint:number",
    bigserial: "bigint:number",
    "bigserial:number": "bigint:number",
    oid: "oid",
    regproc: "regproc",
    regprocedure: "regprocedure",
    regoper: "regoper",
    regoperator: "regoperator",
    regclass: "regclass",
    regtype: "regtype",
    regrole: "regrole",
    regnamespace: "regnamespace",
    regconfig: "regconfig",
    regdictionary: "regdictionary"
  },
  char: {
    char: "char",
    varchar: "char",
    text: "char"
  },
  varchar: {
    char: "varchar",
    varchar: "varchar",
    text: "varchar"
  },
  text: {
    char: "text",
    varchar: "text",
    text: "text"
  },
  bytea: { bytea: "bytea" },
  date: {
    date: "date",
    "date:string": "date",
    timestamp: "timestamp",
    "timestamp:string": "timestamp",
    timestamptz: "timestamptz",
    "timestamptz:string": "timestamptz"
  },
  "date:string": {
    date: "date:string",
    "date:string": "date:string",
    timestamp: "timestamp:string",
    "timestamp:string": "timestamp:string",
    timestamptz: "timestamptz:string",
    "timestamptz:string": "timestamptz:string"
  },
  time: {
    time: "time",
    timetz: "timetz"
  },
  timetz: {
    time: "timetz",
    timetz: "timetz"
  },
  timestamp: {
    date: "timestamp",
    "date:string": "timestamp",
    timestamp: "timestamp",
    "timestamp:string": "timestamp",
    timestamptz: "timestamptz",
    "timestamptz:string": "timestamptz"
  },
  "timestamp:string": {
    date: "timestamp:string",
    "date:string": "timestamp:string",
    timestamp: "timestamp:string",
    "timestamp:string": "timestamp:string",
    timestamptz: "timestamptz:string",
    "timestamptz:string": "timestamptz:string"
  },
  timestamptz: {
    date: "timestamptz",
    "date:string": "timestamptz",
    timestamp: "timestamptz",
    "timestamp:string": "timestamptz",
    timestamptz: "timestamptz",
    "timestamptz:string": "timestamptz"
  },
  "timestamptz:string": {
    date: "timestamptz:string",
    "date:string": "timestamptz:string",
    timestamp: "timestamptz:string",
    "timestamp:string": "timestamptz:string",
    timestamptz: "timestamptz:string",
    "timestamptz:string": "timestamptz:string"
  },
  interval: {
    interval: "interval",
    "interval:tuple": "interval"
  },
  "interval:tuple": {
    interval: "interval:tuple",
    "interval:tuple": "interval:tuple"
  },
  bool: { bool: "bool" },
  enum: { enum: "enum" },
  point: {
    point: "point",
    "point:tuple": "point"
  },
  "point:tuple": {
    point: "point:tuple",
    "point:tuple": "point:tuple"
  },
  line: {
    line: "line",
    "line:tuple": "line"
  },
  "line:tuple": {
    line: "line:tuple",
    "line:tuple": "line:tuple"
  },
  lseg: { lseg: "lseg" },
  box: { box: "box" },
  path: { path: "path" },
  polygon: { polygon: "polygon" },
  circle: { circle: "circle" },
  cidr: {
    cidr: "cidr",
    inet: "inet"
  },
  inet: {
    cidr: "inet",
    inet: "inet"
  },
  macaddr: {
    macaddr: "macaddr",
    macaddr8: "macaddr"
  },
  macaddr8: {
    macaddr: "macaddr8",
    macaddr8: "macaddr8"
  },
  bit: {
    bit: "bit",
    varbit: "bit"
  },
  varbit: {
    bit: "varbit",
    varbit: "varbit"
  },
  tsvector: { tsvector: "tsvector" },
  tsquery: { tsquery: "tsquery" },
  uuid: { uuid: "uuid" },
  xml: { xml: "xml" },
  json: { json: "json" },
  jsonb: { jsonb: "jsonb" },
  int4range: { int4range: "int4range" },
  int8range: { int8range: "int8range" },
  numrange: { numrange: "numrange" },
  tsrange: { tsrange: "tsrange" },
  tstzrange: { tstzrange: "tstzrange" },
  daterange: { daterange: "daterange" },
  int4multirange: { int4multirange: "int4multirange" },
  int8multirange: { int8multirange: "int8multirange" },
  nummultirange: { nummultirange: "nummultirange" },
  tsmultirange: { tsmultirange: "tsmultirange" },
  tstzmultirange: { tstzmultirange: "tstzmultirange" },
  datemultirange: { datemultirange: "datemultirange" },
  oid: {
    smallint: "oid",
    int: "oid",
    bigint: "oid",
    "bigint:number": "oid",
    "bigint:string": "oid",
    smallserial: "oid",
    serial: "oid",
    bigserial: "oid",
    "bigserial:number": "oid",
    oid: "oid",
    regproc: "oid",
    regprocedure: "oid",
    regoper: "oid",
    regoperator: "oid",
    regclass: "oid",
    regtype: "oid",
    regrole: "oid",
    regnamespace: "oid",
    regconfig: "oid",
    regdictionary: "oid"
  },
  regproc: {
    smallint: "regproc",
    int: "regproc",
    bigint: "regproc",
    "bigint:number": "regproc",
    "bigint:string": "regproc",
    smallserial: "regproc",
    serial: "regproc",
    bigserial: "regproc",
    "bigserial:number": "regproc",
    oid: "regproc",
    regproc: "regproc",
    regprocedure: "regproc"
  },
  regprocedure: {
    smallint: "regprocedure",
    int: "regprocedure",
    bigint: "regprocedure",
    "bigint:number": "regprocedure",
    "bigint:string": "regprocedure",
    smallserial: "regprocedure",
    serial: "regprocedure",
    bigserial: "regprocedure",
    "bigserial:number": "regprocedure",
    oid: "regprocedure",
    regproc: "regprocedure",
    regprocedure: "regprocedure"
  },
  regoper: {
    smallint: "regoper",
    int: "regoper",
    bigint: "regoper",
    "bigint:number": "regoper",
    "bigint:string": "regoper",
    smallserial: "regoper",
    serial: "regoper",
    bigserial: "regoper",
    "bigserial:number": "regoper",
    oid: "regoper",
    regoper: "regoper",
    regoperator: "regoper"
  },
  regoperator: {
    smallint: "regoperator",
    int: "regoperator",
    bigint: "regoperator",
    "bigint:number": "regoperator",
    "bigint:string": "regoperator",
    smallserial: "regoperator",
    serial: "regoperator",
    bigserial: "regoperator",
    "bigserial:number": "regoperator",
    oid: "regoperator",
    regoper: "regoperator",
    regoperator: "regoperator"
  },
  regclass: {
    smallint: "regclass",
    int: "regclass",
    bigint: "regclass",
    "bigint:number": "regclass",
    "bigint:string": "regclass",
    smallserial: "regclass",
    serial: "regclass",
    bigserial: "regclass",
    "bigserial:number": "regclass",
    oid: "regclass",
    regclass: "regclass"
  },
  regtype: {
    smallint: "regtype",
    int: "regtype",
    bigint: "regtype",
    "bigint:number": "regtype",
    "bigint:string": "regtype",
    smallserial: "regtype",
    serial: "regtype",
    bigserial: "regtype",
    "bigserial:number": "regtype",
    oid: "regtype",
    regtype: "regtype"
  },
  regrole: {
    smallint: "regrole",
    int: "regrole",
    bigint: "regrole",
    "bigint:number": "regrole",
    "bigint:string": "regrole",
    smallserial: "regrole",
    serial: "regrole",
    bigserial: "regrole",
    "bigserial:number": "regrole",
    oid: "regrole",
    regrole: "regrole"
  },
  regnamespace: {
    smallint: "regnamespace",
    int: "regnamespace",
    bigint: "regnamespace",
    "bigint:number": "regnamespace",
    "bigint:string": "regnamespace",
    smallserial: "regnamespace",
    serial: "regnamespace",
    bigserial: "regnamespace",
    "bigserial:number": "regnamespace",
    oid: "regnamespace",
    regnamespace: "regnamespace"
  },
  regconfig: {
    smallint: "regconfig",
    int: "regconfig",
    bigint: "regconfig",
    "bigint:number": "regconfig",
    "bigint:string": "regconfig",
    smallserial: "regconfig",
    serial: "regconfig",
    bigserial: "regconfig",
    "bigserial:number": "regconfig",
    oid: "regconfig",
    regconfig: "regconfig"
  },
  regdictionary: {
    smallint: "regdictionary",
    int: "regdictionary",
    bigint: "regdictionary",
    "bigint:number": "regdictionary",
    "bigint:string": "regdictionary",
    smallserial: "regdictionary",
    serial: "regdictionary",
    bigserial: "regdictionary",
    "bigserial:number": "regdictionary",
    oid: "regdictionary",
    regdictionary: "regdictionary"
  }
};
var castToText = (name) => sql`${name}::text`;
var castToTextArr = (name, arrayDimensions) => sql`${name}::text${sql.raw("[]".repeat(arrayDimensions))}`;
var arrayCompatCast = (cast) => (name, arrayDimensions) => {
  if (!arrayDimensions)
    return cast(name);
  const aliases = [];
  for (let i = 0;i < arrayDimensions; i++)
    aliases.push(sql.identifier(`s${i}`));
  let indexed = name;
  for (const alias of aliases)
    indexed = sql`${indexed}[${alias}]`;
  let expression = sql`array(\
select ${cast(indexed)} \
from generate_subscripts(${name}, ${sql.raw(arrayDimensions.toString())}) ${aliases[arrayDimensions - 1]} \
order by ${aliases[arrayDimensions - 1]})`;
  for (let dim = arrayDimensions - 1;dim > 0; dim--)
    expression = sql`array(\
select ${expression} \
from generate_subscripts(${name}, ${sql.raw(dim.toString())}) ${aliases[dim - 1]} \
order by ${aliases[dim - 1]})`;
  return sql`case when ${name} is null then null else ${expression} end`;
};
var arrayCompatNormalize = (normalize) => {
  const loop = (value, arrayDimensions) => {
    const innerDimensions = arrayDimensions - 1;
    if (arrayDimensions > 1)
      for (let i = 0;i < value.length; ++i)
        loop(value[i], innerDimensions);
    else
      for (let i = 0;i < value.length; ++i)
        value[i] = normalize(value[i]);
    return value;
  };
  return loop;
};
var arrayCompatNormalizeInput = (normalize, transformToPgArray = false) => {
  const loop = (value, arrayDimensions) => {
    const innerDimensions = arrayDimensions - 1;
    const out = Array.from({ length: value.length });
    if (arrayDimensions > 1)
      for (let i = 0;i < value.length; ++i)
        out[i] = loop(value[i], innerDimensions);
    else
      for (let i = 0;i < value.length; ++i)
        out[i] = normalize(value[i]);
    return out;
  };
  return transformToPgArray ? (v, d) => makePgArray(loop(v, d)) : loop;
};
var parsePgArrayAndNormalize = (normalize) => {
  const codec = arrayCompatNormalize(normalize);
  return (value, arrayDimensions) => codec(parsePgArray(value), arrayDimensions);
};
var parseLineTuple = (v) => {
  const [a, b, c] = v.slice(1, -1).split(",");
  return [
    Number.parseFloat(a),
    Number.parseFloat(b),
    Number.parseFloat(c)
  ];
};
var parseLineABC = (v) => {
  const [a, b, c] = v.slice(1, -1).split(",");
  return {
    a: Number.parseFloat(a),
    b: Number.parseFloat(b),
    c: Number.parseFloat(c)
  };
};
var parsePointTuple = (v) => {
  const [x, y] = v.slice(1, -1).split(",");
  return [Number.parseFloat(x), Number.parseFloat(y)];
};
var parsePointXY = (v) => {
  const [x, y] = v.slice(1, -1).split(",");
  return {
    x: Number.parseFloat(x),
    y: Number.parseFloat(y)
  };
};
var parseGeometryTuple = (v) => parseEWKB(v).point;
var parseGeometryXY = (v) => {
  const parsed = parseEWKB(v);
  return {
    x: parsed.point[0],
    y: parsed.point[1]
  };
};
var textToDate = (v) => new Date(v);
var textToDateWithTz = (v) => /* @__PURE__ */ new Date(v + "+0000");
var parsePgVector = (v) => {
  const body = v.slice(1, -1);
  if (body.length === 0)
    return [];
  return body.split(",").map(Number.parseFloat);
};
var genericPgCodecs = {
  bytea: {
    castInJson: (name) => sql`encode(${name}, 'base64')`,
    castArrayInJson: arrayCompatCast((name) => sql`encode(${name}, 'base64')`),
    normalizeInJson: (v) => Buffer.from(v, "base64"),
    normalizeArrayInJson: arrayCompatNormalize((v) => Buffer.from(v, "base64"))
  },
  bigint: {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalizeInJson: BigInt,
    normalizeArrayInJson: arrayCompatNormalize(BigInt)
  },
  "bigint:number": {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalize: Number,
    normalizeArray: arrayCompatNormalize(Number),
    normalizeInJson: Number,
    normalizeArrayInJson: arrayCompatNormalize(Number)
  },
  "bigint:string": {
    castInJson: castToText,
    castArrayInJson: castToTextArr
  },
  bigserial: {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalizeInJson: BigInt,
    normalizeArrayInJson: arrayCompatNormalize(BigInt),
    normalize: BigInt,
    normalizeArray: arrayCompatNormalize(BigInt)
  },
  "bigserial:number": {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalize: Number,
    normalizeArray: arrayCompatNormalize(Number),
    normalizeInJson: Number,
    normalizeArrayInJson: arrayCompatNormalize(Number)
  },
  date: {
    normalizeInJson: textToDate,
    normalizeArrayInJson: arrayCompatNormalize(textToDate)
  },
  "date:string": {},
  enum: {
    castArray: castToTextArr,
    normalizeParamArray: makePgArray
  },
  "geometry(point)": {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalize: parseGeometryXY,
    normalizeArray: arrayCompatNormalize(parseGeometryXY),
    normalizeInJson: parseGeometryXY,
    normalizeArrayInJson: arrayCompatNormalize(parseGeometryXY)
  },
  "geometry(point):tuple": {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalize: parseGeometryTuple,
    normalizeArray: arrayCompatNormalize(parseGeometryTuple),
    normalizeInJson: parseGeometryTuple,
    normalizeArrayInJson: arrayCompatNormalize(parseGeometryTuple)
  },
  interval: { castArrayInJson: castToTextArr },
  json: { normalizeParamArray: arrayCompatNormalizeInput((v) => JSON.stringify(v), true) },
  jsonb: { normalizeParamArray: arrayCompatNormalizeInput((v) => JSON.stringify(v), true) },
  line: {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalize: parseLineABC,
    normalizeArray: arrayCompatNormalize(parseLineABC),
    normalizeInJson: parseLineABC,
    normalizeArrayInJson: arrayCompatNormalize(parseLineABC)
  },
  "line:tuple": {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalize: parseLineTuple,
    normalizeArray: arrayCompatNormalize(parseLineTuple),
    normalizeInJson: parseLineTuple,
    normalizeArrayInJson: arrayCompatNormalize(parseLineTuple)
  },
  numeric: {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    castArray: castToTextArr
  },
  "numeric:number": {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    castArray: castToTextArr,
    normalize: Number,
    normalizeArray: arrayCompatNormalize(Number),
    normalizeInJson: Number,
    normalizeArrayInJson: arrayCompatNormalize(Number)
  },
  "numeric:bigint": {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    castArray: castToTextArr,
    normalize: BigInt,
    normalizeArray: arrayCompatNormalize(BigInt),
    normalizeInJson: BigInt,
    normalizeArrayInJson: arrayCompatNormalize(BigInt)
  },
  point: {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalize: parsePointXY,
    normalizeArray: arrayCompatNormalize(parsePointXY),
    normalizeInJson: parsePointXY,
    normalizeArrayInJson: arrayCompatNormalize(parsePointXY)
  },
  "point:tuple": {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalize: parsePointTuple,
    normalizeArray: arrayCompatNormalize(parsePointTuple),
    normalizeInJson: parsePointTuple,
    normalizeArrayInJson: arrayCompatNormalize(parsePointTuple)
  },
  timestamp: {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalizeInJson: textToDateWithTz,
    normalizeArrayInJson: arrayCompatNormalize(textToDateWithTz)
  },
  timestamptz: {
    castInJson: castToText,
    castArrayInJson: castToTextArr,
    normalizeInJson: textToDate,
    normalizeArrayInJson: arrayCompatNormalize(textToDate)
  },
  "timestamp:string": {
    castInJson: castToText,
    castArrayInJson: castToTextArr
  },
  "timestamptz:string": {
    castInJson: castToText,
    castArrayInJson: castToTextArr
  },
  halfvec: {
    normalize: parsePgVector,
    normalizeArray: parsePgArrayAndNormalize(parsePgVector),
    normalizeInJson: parsePgVector,
    normalizeArrayInJson: arrayCompatNormalize(parsePgVector)
  },
  vector: {
    normalize: parsePgVector,
    normalizeArray: parsePgArrayAndNormalize(parsePgVector),
    normalizeInJson: parsePgVector,
    normalizeArrayInJson: arrayCompatNormalize(parsePgVector)
  }
};
var refineGenericPgCodecs = (extension) => refineCodecs(genericPgCodecs, extension);

// node_modules/drizzle-orm/node-postgres/codecs.js
var nodePgCodecs = refineGenericPgCodecs({
  bigint: {
    normalize: BigInt,
    normalizeArray: arrayCompatNormalize(BigInt)
  },
  bigserial: {
    normalize: BigInt,
    normalizeArray: arrayCompatNormalize(BigInt)
  },
  bit: { normalizeArray: parsePgArray },
  date: {
    castArray: castToTextArr,
    normalize: textToDate,
    normalizeArray: arrayCompatNormalize(textToDate)
  },
  "date:string": { castArray: castToTextArr },
  timestamp: {
    castArray: castToTextArr,
    normalize: textToDateWithTz,
    normalizeArray: arrayCompatNormalize(textToDateWithTz)
  },
  timestamptz: {
    castArray: castToTextArr,
    normalize: textToDate,
    normalizeArray: arrayCompatNormalize(textToDate)
  },
  "timestamp:string": { castArray: castToTextArr },
  "timestamptz:string": { castArray: castToTextArr },
  "geometry(point)": { normalizeArray: parsePgArrayAndNormalize(parseGeometryXY) },
  "geometry(point):tuple": { normalizeArray: parsePgArrayAndNormalize(parseGeometryTuple) },
  interval: { castArray: castToTextArr },
  json: { normalizeParam: (v) => typeof v === "object" && !Array.isArray(v) ? v : JSON.stringify(v) },
  jsonb: { normalizeParam: (v) => typeof v === "object" && !Array.isArray(v) ? v : JSON.stringify(v) },
  line: {
    cast: castToText,
    castArray: castToTextArr
  },
  "line:tuple": {
    cast: castToText,
    castArray: castToTextArr
  },
  macaddr8: {
    castArrayInJson: castToTextArr,
    castArray: castToTextArr
  },
  point: {
    cast: castToText,
    castArray: castToTextArr
  },
  "point:tuple": {
    cast: castToText,
    castArray: castToTextArr
  },
  sparsevec: { normalizeArray: parsePgArray }
});

// node_modules/drizzle-orm/query-name-generator.js
function isBinary(value) {
  if (typeof Buffer !== "undefined" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(value))
    return true;
  if (value instanceof ArrayBuffer)
    return true;
  if (ArrayBuffer.isView(value))
    return true;
  return false;
}
function arrayTypeId(arr) {
  if (!arr.length)
    return "array<void>";
  let elementId;
  for (let i = 0;i < arr.length; i++) {
    const id = jsTypeId(arr[i]);
    if (!elementId) {
      elementId = id;
      continue;
    }
    if (elementId !== id) {
      elementId = `${elementId},${id}`;
      continue;
    }
    elementId = id;
  }
  return `array<${elementId}>`;
}
function jsTypeId(value) {
  if (value === null)
    return "null";
  if (is(value, Placeholder))
    return "placeholder";
  if (value instanceof Date)
    return "date";
  if (Array.isArray(value))
    return arrayTypeId(value);
  if (isBinary(value))
    return "binary";
  return typeof value;
}
function hash(str, seed = 5381) {
  let h = seed;
  for (let i = 0;i < str.length; i++)
    h = (h << 5) + h ^ str.charCodeAt(i);
  return h >>> 0;
}
var safeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
function stringify(hash, length, startWithLetter = false) {
  let result = "";
  let h = hash;
  if (startWithLetter) {
    result += safeChars[h % 52];
    h = h >>> 6;
    --length;
  }
  while (result.length < length) {
    result += safeChars[h % 63];
    h = h >>> 6;
    if (h === 0)
      break;
  }
  return result;
}
function preparedStatementName(sql, params = []) {
  let hash1 = hash(sql);
  let hash2 = hash(sql, -559043606);
  const paramIds = params.map(jsTypeId).join(",");
  for (let ti = 0;ti < paramIds.length; ti++) {
    hash1 = (hash1 << 5) + hash1 ^ paramIds.charCodeAt(ti);
    hash2 = (hash2 << 5) + hash2 ^ paramIds.charCodeAt(ti);
  }
  return stringify(hash1, 31, true) + stringify(hash2, 32);
}

// node_modules/drizzle-orm/logger.js
var ConsoleLogWriter2 = class {
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
};
var DefaultLogger2 = class {
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter2;
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
var NoopLogger2 = class {
  static [entityKind] = "NoopLogger";
  logQuery() {}
};

// node_modules/drizzle-orm/cache/core/cache.js
var Cache = class {
  static [entityKind] = "Cache";
};
var NoopCache = class extends Cache {
  static [entityKind] = "NoopCache";
  strategy() {
    return "all";
  }
  async get(_key) {}
  async put(_hashedQuery, _response, _tables, _config) {}
  async onMutate(_params) {}
};
var strategyFor = async (query, params, queryMetadata, withCacheConfig) => {
  if (!queryMetadata)
    return { type: "skip" };
  const { type, tables } = queryMetadata;
  if ((type === "insert" || type === "update" || type === "delete") && tables.length > 0)
    return {
      type: "invalidate",
      tables
    };
  if (!withCacheConfig)
    return { type: "skip" };
  if (!withCacheConfig.enabled)
    return { type: "skip" };
  if (type === "select")
    return {
      type: "try",
      key: withCacheConfig.tag ?? await hashQuery(query, params),
      isTag: typeof withCacheConfig.tag !== "undefined",
      autoInvalidate: withCacheConfig.autoInvalidate,
      tables: queryMetadata.tables,
      config: withCacheConfig.config
    };
  return { type: "skip" };
};
async function hashQuery(sql, params) {
  const dataToHash = `${sql}-${JSON.stringify(params, (_, v) => typeof v === "bigint" ? `${v}n` : v)}`;
  const data = new TextEncoder().encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// node_modules/drizzle-orm/pg-core/query-builders/count.js
var PgCountBuilder = class PgCountBuilder extends SQL {
  static [entityKind] = "PgCountBuilder";
  dialect;
  static buildCount(source, filters, parens) {
    const query = sql`select count(*) from ${source}${sql` where ${filters}`.if(filters)}`;
    return parens ? sql`(${query})` : query;
  }
  constructor(countConfig) {
    super(PgCountBuilder.buildCount(countConfig.source, countConfig.filters, true).queryChunks);
    this.countConfig = countConfig;
    this.dialect = countConfig.dialect;
    this.mapWith((e) => {
      if (typeof e === "number")
        return e;
      return Number(e ?? 0);
    });
  }
  executableSql;
  build() {
    if (!this.executableSql) {
      const { source, filters } = this.countConfig;
      this.executableSql = PgCountBuilder.buildCount(source, filters);
    }
    return this.dialect.sqlToQuery(this.executableSql);
  }
};

// node_modules/drizzle-orm/utils.js
var FnConstructor2 = Object.getPrototypeOf(() => null).constructor;
function makeJitQueryMapperInner(columns, joinsNotNullableMap = {}) {
  const preFn = [];
  const fn = [];
  fn.push(`const [ ${columns.map((_, i) => `c${i}`).join(", ")} ] = rows[i];`);
  const nullifyMap = {};
  const objectIds = {};
  const decodes = Array.from({ length: columns.length });
  for (let idx = 0;idx < columns.length; ++idx) {
    const { field, path, codec, arrayDimensions } = columns[idx];
    let decoder;
    let decoderStr;
    let decoderFieldDestructure;
    let isColumn = false;
    if (is(field, Column)) {
      isColumn = true;
      decoder = field;
      decoderFieldDestructure = `field: decoder${idx}`;
    } else if (is(field, SQL)) {
      decoder = field.decoder;
      decoderFieldDestructure = `field: { decoder: decoder${idx} }`;
    } else if (is(field, Subquery)) {
      decoder = field._.sql.decoder;
      decoderFieldDestructure = `field: { _: { sql: { decoder: decoder${idx} } } }`;
    } else {
      decoder = field.sql.decoder;
      decoderFieldDestructure = `field: { sql: { decoder: decoder${idx} } }`;
    }
    decoderStr = `decoder${idx}.mapFromDriverValue`;
    if (decoder.mapFromDriverValue.isNoop)
      decoderStr = "";
    if (decoderStr)
      preFn.push(`const { ${decoderFieldDestructure}${codec ? `, codec: codec${idx}` : ""} } = columns[${idx}];`);
    else if (codec)
      preFn.push(`const { codec: codec${idx} } = columns[${idx}];`);
    const colStr = `c${idx}`;
    let decodedValue = colStr;
    if (codec)
      decodedValue = `codec${idx}(${decodedValue}, ${arrayDimensions})`;
    if (decoderStr)
      decodedValue = `${decoderStr}(${decodedValue})`;
    decodes[idx] = colStr === decodedValue ? `${colStr}` : `${colStr} === null ? ${colStr} : ${decodedValue}`;
    if (path.length !== 2 || !isColumn)
      continue;
    if (objectIds[path[0]] === undefined)
      objectIds[path[0]] = [`c${idx}`];
    else
      objectIds[path[0]]?.push(`c${idx}`);
    const [objectName] = path;
    const tableName = getTableName(field.table);
    nullifyMap[objectName] = joinsNotNullableMap[tableName] ? false : typeof nullifyMap[objectName] === "string" ? nullifyMap[objectName] === tableName ? tableName : false : tableName;
  }
  fn.push(`mapped[i] = {`);
  let currentObjectPath = [];
  for (let idx = 0;idx < columns.length; ++idx) {
    const { path } = columns[idx];
    const jsonPath = path.map((e) => JSON.stringify(e));
    const decodedValue = decodes[idx];
    const objectPath = path.slice(0, -1);
    let commonLen = 0;
    while (commonLen < currentObjectPath.length && commonLen < objectPath.length && currentObjectPath[commonLen] === objectPath[commonLen])
      commonLen++;
    for (let d = currentObjectPath.length - 1;d >= commonLen; --d)
      fn.push(`${"\t".repeat(d + 1)}},`);
    for (let d = commonLen;d < objectPath.length; ++d)
      fn.push(`${"\t".repeat(d + 1)}${jsonPath[d]}: ${d === 0 && objectPath.length === 1 && typeof nullifyMap[path[0]] === "string" ? `${objectIds[path[0]]?.map((c) => `${c} === null`).join(" && ")} ? null : {` : "{"}`);
    currentObjectPath = objectPath;
    fn.push(`${"\t".repeat(path.length)}${jsonPath[path.length - 1]}: ${decodedValue},`);
  }
  for (let d = currentObjectPath.length - 1;d >= 0; --d)
    fn.push(`${"\t".repeat(d + 1)}},`);
  fn.push(`};`);
  return `${preFn.length ? `${preFn.join(`
	`)}
	` : ""}for (let i = 0; i < length; ++i) {
		${fn.join(`
		`)}
	}`;
}
function makeJitQueryMapper2(columns, joinsNotNullableMap) {
  const internals = `	"use strict";
	const { columns } = this;
	const { length } = rows;
	const mapped = Array.from({ length });
	${makeJitQueryMapperInner(columns, joinsNotNullableMap)}
	return mapped;
	//# sourceURL=drizzle:jit-query-mapper`;
  return Object.assign(new FnConstructor2("rows", internals).bind({ columns }), { body: `function jitQueryMapper (rows) {
${internals}
}` });
}
function jitCompatCheck2(isEnabled) {
  if (!isEnabled)
    return false;
  try {
    const res = new FnConstructor2("input", '"use strict"; return input;')(true);
    if (res !== true) {
      console.warn(`Unable to use jit mappers due to incompatibility: corrupted jit function output.
Falling back to premade mappers.
Error details:`);
      console.error(`Expected to receive \`true\`, got: ${res}`);
    }
    return true;
  } catch (e) {
    console.warn(`Unable to use jit mappers due to incompatibility.
Falling back to premade mappers.
Error details:`);
    console.error(e);
    return false;
  }
}
function makeDefaultQueryMapper2(columns, joinsNotNullableMap) {
  const interpretedData = columns.map(({ field, codec, arrayDimensions, path }) => {
    let processNullifyMap;
    let decoderSrc;
    if (is(field, Column)) {
      decoderSrc = field;
      if (joinsNotNullableMap && path.length === 2) {
        const objectName = path[0];
        processNullifyMap = (nullifyMap, value) => {
          if (!(objectName in nullifyMap))
            nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
          else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table))
            nullifyMap[objectName] = false;
        };
      }
    } else if (is(field, SQL))
      decoderSrc = field.decoder;
    else if (is(field, Subquery))
      decoderSrc = field._.sql.decoder;
    else
      decoderSrc = field.sql.decoder;
    let decoder;
    if (decoderSrc.mapFromDriverValue.isNoop)
      decoder = codec ? (v) => codec(v, arrayDimensions) : undefined;
    else
      decoder = codec ? (v) => decoderSrc.mapFromDriverValue(codec(v, arrayDimensions)) : (v) => decoderSrc.mapFromDriverValue(v);
    return [decoder, processNullifyMap];
  });
  return (rows) => rows.map((row) => {
    const nullifyMap = {};
    const result = columns.reduce((result, { path }, columnIndex) => {
      let node = result;
      for (const [pathChunkIndex, pathChunk] of path.entries())
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node))
            node[pathChunk] = {};
          node = node[pathChunk];
        } else {
          const [decoder, processNullifyMap] = interpretedData[columnIndex];
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder ? decoder(rawValue) : rawValue;
          processNullifyMap?.(nullifyMap, value);
        }
      return result;
    }, {});
    if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
      for (const [objectName, tableName] of Object.entries(nullifyMap))
        if (typeof tableName === "string" && !joinsNotNullableMap[tableName])
          result[objectName] = null;
    }
    return result;
  });
}
function orderSelectedFields2(fields, pathPrefix, codecs) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string")
      return result;
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column))
      result.push({
        path: newPath,
        field,
        codec: codecs?.get(field, "normalize"),
        arrayDimensions: field.dimensions,
        column: field
      });
    else if (is(field, SQL) || is(field, SQL.Aliased)) {
      const col = getColumnFromDecoder2(field);
      result.push(col ? {
        path: newPath,
        field,
        codec: codecs?.get(col, "normalize"),
        arrayDimensions: col.dimensions,
        column: col
      } : {
        path: newPath,
        field
      });
    } else if (is(field, Subquery)) {
      let column;
      const entry = Object.values(field._.selectedFields)[0];
      let fieldDecoder;
      if (is(entry, Column)) {
        column = entry;
        fieldDecoder = entry;
      } else if (is(entry, SQL)) {
        column = getColumnFromDecoder2(entry);
        fieldDecoder = entry.decoder;
      } else {
        column = getColumnFromDecoder2(entry);
        fieldDecoder = entry.sql.decoder;
      }
      if (fieldDecoder)
        field._.sql.decoder = fieldDecoder;
      result.push(column ? {
        path: newPath,
        field,
        codec: codecs?.get(column, "normalize"),
        arrayDimensions: column.dimensions,
        column
      } : {
        path: newPath,
        field
      });
    } else if (is(field, Table))
      result.push(...orderSelectedFields2(field[Table.Symbol.Columns], newPath, codecs));
    else
      result.push(...orderSelectedFields2(field, newPath, codecs));
    return result;
  }, []);
}
function getColumnFromDecoder2(source) {
  const query = source.getSQL();
  if (is(query.decoder, Column))
    return query.decoder;
}
function haveSameKeys2(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length)
    return false;
  for (const [index, key] of leftKeys.entries())
    if (key !== rightKeys[index])
      return false;
  return true;
}
function mapUpdateSet2(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== undefined).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column))
      return [key, value];
    else
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
  });
  if (entries.length === 0)
    throw new Error("No values to set");
  return Object.fromEntries(entries);
}
function applyMixins2(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses)
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor")
        continue;
      Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || Object.create(null));
    }
}
function getTableColumns2(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName2(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? undefined : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig2(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
var textDecoder2 = typeof TextDecoder === "undefined" ? null : new TextDecoder;
function assertUnreachable2(_x) {
  throw new Error("Didn't expect to get here");
}
var CONSTANTS2 = {
  INT8_MIN: -128,
  INT8_MAX: 127,
  INT8_UNSIGNED_MAX: 255,
  INT16_MIN: -32768,
  INT16_MAX: 32767,
  INT16_UNSIGNED_MAX: 65535,
  INT24_MIN: -8388608,
  INT24_MAX: 8388607,
  INT24_UNSIGNED_MAX: 16777215,
  INT32_MIN: -2147483648,
  INT32_MAX: 2147483647,
  INT32_UNSIGNED_MAX: 4294967295,
  INT48_MIN: -140737488355328,
  INT48_MAX: 140737488355327,
  INT48_UNSIGNED_MAX: 281474976710655,
  INT64_MIN: -9223372036854775808n,
  INT64_MAX: 9223372036854775807n,
  INT64_UNSIGNED_MAX: 18446744073709551615n
};

// node_modules/drizzle-orm/query-promise.js
var QueryPromise2 = class {
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(onFinally) {
    return this.then((value) => {
      onFinally?.();
      return value;
    }, (reason) => {
      onFinally?.();
      throw reason;
    });
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};

// node_modules/drizzle-orm/pg-core/async/count.js
var PgAsyncCountBuilder = class extends PgCountBuilder {
  static [entityKind] = "PgAsyncCountBuilder";
  session;
  constructor({ source, dialect, filters, session }) {
    super({
      source,
      dialect,
      filters
    });
    this.session = session;
  }
  execute(placeholderValues) {
    return this.session.prepareQuery(this.build(), "arrays", false, (rows) => {
      const v = rows[0]?.[0];
      if (typeof v === "number")
        return v;
      return v ? Number(v) : 0;
    }).execute(placeholderValues);
  }
};
applyMixins2(PgAsyncCountBuilder, [QueryPromise2]);

// node_modules/drizzle-orm/pg-core/query-builders/query.js
var RelationalQueryBuilder = class {
  static [entityKind] = "PgRelationalQueryBuilderV2";
  constructor(schema, table, tableConfig, dialect, session, parseJson, builder = PgRelationalQuery) {
    this.schema = schema;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.parseJson = parseJson;
    this.builder = builder;
  }
  findMany(config) {
    return new this.builder(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "many", this.parseJson);
  }
  findFirst(config) {
    return new this.builder(this.schema, this.table, this.tableConfig, this.dialect, this.session, config ?? true, "first", this.parseJson);
  }
};
var PgRelationalQuery = class {
  static [entityKind] = "PgRelationalQueryV2";
  constructor(schema, table, tableConfig, dialect, session, config, mode, parseJson) {
    this.schema = schema;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config;
    this.mode = mode;
    this.parseJson = parseJson;
  }
  _getQuery() {
    return this.dialect.buildRelationalQuery({
      schema: this.schema,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      mode: this.mode
    });
  }
  getSQL() {
    return this._getQuery().sql;
  }
  _toSQL() {
    const query = this._getQuery();
    return {
      query,
      builtQuery: this.dialect.sqlToQuery(query.sql)
    };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
};

// node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder = class {
  static [entityKind] = "PgForeignKeyBuilder";
  reference;
  _onUpdate = "no action";
  _onDelete = "no action";
  constructor(config, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return {
        name,
        columns,
        foreignTable: foreignColumns[0].table,
        foreignColumns
      };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === undefined ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === undefined ? "no action" : action;
    return this;
  }
  build(table) {
    return new ForeignKey(table, this);
  }
};
var ForeignKey = class {
  static [entityKind] = "PgForeignKey";
  reference;
  onUpdate;
  onDelete;
  name;
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
  isNameExplicit() {
    return !!this.reference().name;
  }
};

// node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder = class {
  static [entityKind] = "PgColumnBuilder";
  foreignKeyConfigs = [];
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: undefined,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: undefined,
      uniqueType: undefined,
      dataType,
      columnType,
      generated: undefined,
      defaultFn: undefined,
      onUpdateFn: undefined,
      generatedIdentity: undefined
    };
  }
  $type() {
    return this;
  }
  notNull() {
    this.config.notNull = true;
    return this;
  }
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  $default = this.$defaultFn;
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  $onUpdate = this.$onUpdateFn;
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  setName(name, casingFn) {
    if (this.config.name !== "")
      return;
    this.config.name = casingFn(name);
  }
  array(dimensions) {
    const dim = dimensions ?? "[]";
    this.config.dimensions = dim.length / 2;
    return this;
  }
  references(ref, config = {}) {
    this.foreignKeyConfigs.push({
      ref,
      config
    });
    return this;
  }
  unique(name, config) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config?.nulls;
    return this;
  }
  generatedAlwaysAs(as) {
    this.config.generated = {
      as,
      type: "always",
      mode: "stored"
    };
    return this;
  }
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, config }) => {
      return iife((ref, config) => {
        const builder = new ForeignKeyBuilder(() => {
          const foreignColumn = ref();
          return {
            name: config.name,
            columns: [column],
            foreignColumns: [foreignColumn]
          };
        });
        if (config.onUpdate)
          builder.onUpdate(config.onUpdate);
        if (config.onDelete)
          builder.onDelete(config.onDelete);
        return builder.build(table);
      }, ref, config);
    });
  }
  buildExtraConfigColumn(table) {
    return new ExtraConfigColumn(table, {
      ...this.config,
      dimensions: this.config.dimensions ?? 0
    });
  }
};
var PgColumn = class extends Column {
  static [entityKind] = "PgColumn";
  table;
  dimensions;
  constructor(table, config) {
    super(table, config);
    this.table = table;
    this.dimensions = config.dimensions ?? 0;
  }
  postBuild() {
    if (this.dimensions) {
      const originalFromDriver = this.mapFromDriverValue.bind(this);
      const originalToDriver = this.mapToDriverValue.bind(this);
      this.mapFromDriverValue = this.mapFromDriverValue.isNoop ? this.mapFromDriverValue : (value) => {
        return this.mapArrayElements(value, originalFromDriver, this.dimensions);
      };
      this.mapToDriverValue = this.mapToDriverValue.isNoop ? this.mapToDriverValue : (value) => {
        return this.mapArrayElements(value, originalToDriver, this.dimensions);
      };
    }
    return this;
  }
  shouldDisableInsert() {
    return this.config.generatedIdentity !== undefined && this.config.generatedIdentity.type !== "byDefault" || this.config.generated !== undefined && this.config.generated.type !== "byDefault";
  }
  mapArrayElements(value, mapper, depth) {
    if (depth > 0 && Array.isArray(value))
      return value.map((v) => v === null ? null : this.mapArrayElements(v, mapper, depth - 1));
    return mapper(value);
  }
};
var ExtraConfigColumn = class extends PgColumn {
  static [entityKind] = "ExtraConfigColumn";
  codec = undefined;
  getSQLType() {
    return this.getSQLType();
  }
  indexConfig = {
    order: this.config.order ?? "asc",
    nulls: this.config.nulls ?? "last",
    opClass: this.config.opClass
  };
  defaultConfig = {
    order: "asc",
    nulls: "last",
    opClass: undefined
  };
  asc() {
    this.indexConfig.order = "asc";
    return this;
  }
  desc() {
    this.indexConfig.order = "desc";
    return this;
  }
  nullsFirst() {
    this.indexConfig.nulls = "first";
    return this;
  }
  nullsLast() {
    this.indexConfig.nulls = "last";
    return this;
  }
  op(opClass) {
    this.indexConfig.opClass = opClass;
    return this;
  }
};
var IndexedColumn = class {
  static [entityKind] = "IndexedColumn";
  constructor(name, keyAsName, type, indexConfig) {
    this.name = name;
    this.keyAsName = keyAsName;
    this.type = type;
    this.indexConfig = indexConfig;
  }
  name;
  keyAsName;
  type;
  indexConfig;
};

// node_modules/drizzle-orm/pg-core/columns/int.common.js
var PgIntColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgIntColumnBaseBuilder";
  generatedAlwaysAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "always",
        sequenceName: name,
        sequenceOptions: options
      };
    } else
      this.config.generatedIdentity = { type: "always" };
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
  generatedByDefaultAsIdentity(sequence) {
    if (sequence) {
      const { name, ...options } = sequence;
      this.config.generatedIdentity = {
        type: "byDefault",
        sequenceName: name,
        sequenceOptions: options
      };
    } else
      this.config.generatedIdentity = { type: "byDefault" };
    this.config.hasDefault = true;
    this.config.notNull = true;
    return this;
  }
};

// node_modules/drizzle-orm/pg-core/columns/bigint.js
var PgBigInt53Builder = class extends PgIntColumnBuilder {
  static [entityKind] = "PgBigInt53Builder";
  constructor(name) {
    super(name, "number int53", "PgBigInt53");
  }
  build(table) {
    return new PgBigInt53(table, this.config);
  }
};
var PgBigInt53 = class extends PgColumn {
  static [entityKind] = "PgBigInt53";
  codec = "bigint:number";
  getSQLType() {
    return "bigint";
  }
};
var PgBigInt64Builder = class extends PgIntColumnBuilder {
  static [entityKind] = "PgBigInt64Builder";
  constructor(name) {
    super(name, "bigint int64", "PgBigInt64");
  }
  build(table) {
    return new PgBigInt64(table, this.config);
  }
};
var PgBigInt64 = class extends PgColumn {
  static [entityKind] = "PgBigInt64";
  codec = "bigint";
  getSQLType() {
    return "bigint";
  }
};
var PgBigIntStringBuilder = class extends PgIntColumnBuilder {
  static [entityKind] = "PgBigIntStringBuilder";
  constructor(name) {
    super(name, "string int64", "PgBigIntString");
  }
  build(table) {
    return new PgBigIntString(table, this.config);
  }
};
var PgBigIntString = class extends PgColumn {
  static [entityKind] = "PgBigIntString";
  codec = "bigint:string";
  getSQLType() {
    return "bigint";
  }
};
function bigint(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  if (config.mode === "number")
    return new PgBigInt53Builder(name);
  if (config.mode === "string")
    return new PgBigIntStringBuilder(name);
  return new PgBigInt64Builder(name);
}

// node_modules/drizzle-orm/pg-core/columns/bigserial.js
var PgBigSerial53Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgBigSerial53Builder";
  constructor(name) {
    super(name, "number int53", "PgBigSerial53");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  build(table) {
    return new PgBigSerial53(table, this.config);
  }
};
var PgBigSerial53 = class extends PgColumn {
  static [entityKind] = "PgBigSerial53";
  codec = "bigserial:number";
  getSQLType() {
    return "bigserial";
  }
};
var PgBigSerial64Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgBigSerial64Builder";
  constructor(name) {
    super(name, "bigint int64", "PgBigSerial64");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  build(table) {
    return new PgBigSerial64(table, this.config);
  }
};
var PgBigSerial64 = class extends PgColumn {
  static [entityKind] = "PgBigSerial64";
  codec = "bigserial";
  getSQLType() {
    return "bigserial";
  }
};
function bigserial(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  if (config.mode === "number")
    return new PgBigSerial53Builder(name);
  return new PgBigSerial64Builder(name);
}

// node_modules/drizzle-orm/pg-core/columns/boolean.js
var PgBooleanBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgBooleanBuilder";
  constructor(name) {
    super(name, "boolean", "PgBoolean");
  }
  build(table) {
    return new PgBoolean(table, this.config);
  }
};
var PgBoolean = class extends PgColumn {
  static [entityKind] = "PgBoolean";
  codec = "bool";
  getSQLType() {
    return "boolean";
  }
};
function boolean(name) {
  return new PgBooleanBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/char.js
var PgCharBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCharBuilder";
  constructor(name, config) {
    super(name, config.enum?.length ? "string enum" : "string", "PgChar");
    this.config.length = config.length ?? 1;
    this.config.setLength = config.length !== undefined;
    this.config.enumValues = config.enum;
  }
  build(table) {
    return new PgChar(table, this.config);
  }
};
var PgChar = class extends PgColumn {
  static [entityKind] = "PgChar";
  codec = "char";
  enumValues;
  setLength;
  constructor(table, config) {
    super(table, config);
    this.enumValues = config.enumValues;
    this.setLength = config.setLength;
  }
  getSQLType() {
    return this.setLength ? `char(${this.length})` : `char`;
  }
};
function char(a, b = {}) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgCharBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/cidr.js
var PgCidrBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCidrBuilder";
  constructor(name) {
    super(name, "string cidr", "PgCidr");
  }
  build(table) {
    return new PgCidr(table, this.config);
  }
};
var PgCidr = class extends PgColumn {
  static [entityKind] = "PgCidr";
  codec = "cidr";
  getSQLType() {
    return "cidr";
  }
};
function cidr(name) {
  return new PgCidrBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/custom.js
var PgCustomColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgCustomColumnBuilder";
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "PgCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  build(table) {
    return new PgCustomColumn(table, this.config);
  }
};
var PgCustomColumn = class extends PgColumn {
  static [entityKind] = "PgCustomColumn";
  codec;
  sqlName;
  mapFromJsonValue;
  jsonSelectIdentifier;
  constructor(table, config) {
    super(table, config);
    this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
    this.mapToDriverValue = config.customTypeParams.toDriver ?? this.mapToDriverValue;
    this.mapFromDriverValue = config.customTypeParams.fromDriver ?? this.mapFromDriverValue;
    this.mapFromJsonValue = config.customTypeParams.fromJson;
    this.jsonSelectIdentifier = config.customTypeParams.forJsonSelect;
    const cfgCodec = typeof config.customTypeParams.codec === "string" || typeof config.customTypeParams.codec === "undefined" ? config.customTypeParams.codec : config.customTypeParams.codec(config.fieldConfig);
    this.codec = typeof cfgCodec === "string" ? resolvePgTypeAlias(cfgCodec) : undefined;
    if (this.dimensions && config.customTypeParams.fromJson)
      this.mapFromJsonValue = (value) => {
        if (value === null)
          return value;
        const arr = typeof value === "string" ? parsePgArray(value) : value;
        return this.mapJsonArrayElements(arr, config.customTypeParams.fromJson, this.dimensions);
      };
  }
  mapJsonArrayElements(value, mapper, depth) {
    if (depth > 0 && Array.isArray(value))
      return value.map((v) => v === null ? null : this.mapJsonArrayElements(v, mapper, depth - 1));
    return mapper(value);
  }
  getSQLType() {
    return this.sqlName;
  }
};
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = getColumnNameAndConfig2(a, b);
    return new PgCustomColumnBuilder(name, config, customTypeParams);
  };
}

// node_modules/drizzle-orm/pg-core/columns/date.common.js
var PgDateColumnBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDateColumnBaseBuilder";
  defaultNow() {
    return this.default(sql`now()`);
  }
};

// node_modules/drizzle-orm/pg-core/columns/date.js
var PgDateBuilder = class extends PgDateColumnBuilder {
  static [entityKind] = "PgDateBuilder";
  constructor(name) {
    super(name, "object date", "PgDate");
  }
  build(table) {
    return new PgDate(table, this.config);
  }
};
var PgDate = class extends PgColumn {
  static [entityKind] = "PgDate";
  codec = "date";
  getSQLType() {
    return "date";
  }
  mapToDriverValue = function(value) {
    if (typeof value === "string")
      return value;
    return value.toISOString();
  };
};
var PgDateStringBuilder = class extends PgDateColumnBuilder {
  static [entityKind] = "PgDateStringBuilder";
  constructor(name) {
    super(name, "string date", "PgDateString");
  }
  build(table) {
    return new PgDateString(table, this.config);
  }
};
var PgDateString = class extends PgColumn {
  static [entityKind] = "PgDateString";
  codec = "date:string";
  getSQLType() {
    return "date";
  }
  mapToDriverValue = (value) => {
    if (typeof value === "string")
      return value;
    return value.toISOString();
  };
};
function date(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  if (config?.mode === "date")
    return new PgDateBuilder(name);
  return new PgDateStringBuilder(name);
}

// node_modules/drizzle-orm/pg-core/columns/double-precision.js
var PgDoublePrecisionBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgDoublePrecisionBuilder";
  constructor(name) {
    super(name, "number double", "PgDoublePrecision");
  }
  build(table) {
    return new PgDoublePrecision(table, this.config);
  }
};
var PgDoublePrecision = class extends PgColumn {
  static [entityKind] = "PgDoublePrecision";
  codec = "float8";
  getSQLType() {
    return "double precision";
  }
};
function doublePrecision(name) {
  return new PgDoublePrecisionBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/inet.js
var PgInetBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgInetBuilder";
  constructor(name) {
    super(name, "string inet", "PgInet");
  }
  build(table) {
    return new PgInet(table, this.config);
  }
};
var PgInet = class extends PgColumn {
  static [entityKind] = "PgInet";
  codec = "inet";
  getSQLType() {
    return "inet";
  }
};
function inet(name) {
  return new PgInetBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/integer.js
var PgIntegerBuilder = class extends PgIntColumnBuilder {
  static [entityKind] = "PgIntegerBuilder";
  constructor(name) {
    super(name, "number int32", "PgInteger");
  }
  build(table) {
    return new PgInteger(table, this.config);
  }
};
var PgInteger = class extends PgColumn {
  static [entityKind] = "PgInteger";
  codec = "int";
  getSQLType() {
    return "integer";
  }
};
function integer(name) {
  return new PgIntegerBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/interval.js
var PgIntervalBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgIntervalBuilder";
  constructor(name, intervalConfig) {
    super(name, "string interval", "PgInterval");
    this.config.intervalConfig = intervalConfig;
  }
  build(table) {
    return new PgInterval(table, this.config);
  }
};
var PgInterval = class extends PgColumn {
  static [entityKind] = "PgInterval";
  codec = "interval";
  fields;
  precision;
  constructor(table, config) {
    super(table, config);
    this.fields = config.intervalConfig.fields;
    this.precision = config.intervalConfig.precision;
  }
  getSQLType() {
    return `interval${this.fields ? ` ${this.fields}` : ""}${this.precision ? `(${this.precision})` : ""}`;
  }
};
function interval(a, b = {}) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgIntervalBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/json.js
var PgJsonBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonBuilder";
  constructor(name) {
    super(name, "object json", "PgJson");
  }
  build(table) {
    return new PgJson(table, this.config);
  }
};
var PgJson = class extends PgColumn {
  static [entityKind] = "PgJson";
  codec = "json";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "json";
  }
};
function json(name) {
  return new PgJsonBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/jsonb.js
var PgJsonbBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgJsonbBuilder";
  constructor(name) {
    super(name, "object json", "PgJsonb");
  }
  build(table) {
    return new PgJsonb(table, this.config);
  }
};
var PgJsonb = class extends PgColumn {
  static [entityKind] = "PgJsonb";
  codec = "jsonb";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "jsonb";
  }
};
function jsonb(name) {
  return new PgJsonbBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/line.js
var PgLineBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgLineBuilder";
  constructor(name) {
    super(name, "array line", "PgLine");
  }
  build(table) {
    return new PgLineTuple(table, this.config);
  }
};
var PgLineTuple = class extends PgColumn {
  static [entityKind] = "PgLine";
  codec = "line:tuple";
  mode = "tuple";
  getSQLType() {
    return "line";
  }
  mapToDriverValue = (value) => {
    return `{${value[0]},${value[1]},${value[2]}}`;
  };
};
var PgLineABCBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgLineABCBuilder";
  constructor(name) {
    super(name, "object line", "PgLineABC");
  }
  build(table) {
    return new PgLineABC(table, this.config);
  }
};
var PgLineABC = class extends PgColumn {
  static [entityKind] = "PgLineABC";
  codec = "line";
  mode = "abc";
  getSQLType() {
    return "line";
  }
  mapToDriverValue = (value) => {
    return `{${value.a},${value.b},${value.c}}`;
  };
};
function line(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  if (!config?.mode || config.mode === "tuple")
    return new PgLineBuilder(name);
  return new PgLineABCBuilder(name);
}

// node_modules/drizzle-orm/pg-core/columns/macaddr.js
var PgMacaddrBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgMacaddrBuilder";
  constructor(name) {
    super(name, "string macaddr", "PgMacaddr");
  }
  build(table) {
    return new PgMacaddr(table, this.config);
  }
};
var PgMacaddr = class extends PgColumn {
  static [entityKind] = "PgMacaddr";
  codec = "macaddr";
  getSQLType() {
    return "macaddr";
  }
};
function macaddr(name) {
  return new PgMacaddrBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/macaddr8.js
var PgMacaddr8Builder = class extends PgColumnBuilder {
  static [entityKind] = "PgMacaddr8Builder";
  constructor(name) {
    super(name, "string macaddr8", "PgMacaddr8");
  }
  build(table) {
    return new PgMacaddr8(table, this.config);
  }
};
var PgMacaddr8 = class extends PgColumn {
  static [entityKind] = "PgMacaddr8";
  codec = "macaddr8";
  getSQLType() {
    return "macaddr8";
  }
};
function macaddr8(name) {
  return new PgMacaddr8Builder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/numeric.js
var PgNumericBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericBuilder";
  constructor(name, precision, scale) {
    super(name, "string numeric", "PgNumeric");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  build(table) {
    return new PgNumeric(table, this.config);
  }
};
var PgNumeric = class extends PgColumn {
  static [entityKind] = "PgNumeric";
  codec = "numeric";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  getSQLType() {
    if (this.precision !== undefined && this.scale !== undefined)
      return `numeric(${this.precision}, ${this.scale})`;
    else if (this.precision === undefined)
      return "numeric";
    else
      return `numeric(${this.precision})`;
  }
};
var PgNumericNumberBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericNumberBuilder";
  constructor(name, precision, scale) {
    super(name, "number", "PgNumericNumber");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  build(table) {
    return new PgNumericNumber(table, this.config);
  }
};
var PgNumericNumber = class extends PgColumn {
  static [entityKind] = "PgNumericNumber";
  codec = "numeric:number";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  mapToDriverValue = String;
  getSQLType() {
    if (this.precision !== undefined && this.scale !== undefined)
      return `numeric(${this.precision}, ${this.scale})`;
    else if (this.precision === undefined)
      return "numeric";
    else
      return `numeric(${this.precision})`;
  }
};
var PgNumericBigIntBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgNumericBigIntBuilder";
  constructor(name, precision, scale) {
    super(name, "bigint int64", "PgNumericBigInt");
    this.config.precision = precision;
    this.config.scale = scale;
  }
  build(table) {
    return new PgNumericBigInt(table, this.config);
  }
};
var PgNumericBigInt = class extends PgColumn {
  static [entityKind] = "PgNumericBigInt";
  codec = "numeric:bigint";
  precision;
  scale;
  constructor(table, config) {
    super(table, config);
    this.precision = config.precision;
    this.scale = config.scale;
  }
  mapToDriverValue = String;
  getSQLType() {
    if (this.precision !== undefined && this.scale !== undefined)
      return `numeric(${this.precision}, ${this.scale})`;
    else if (this.precision === undefined)
      return "numeric";
    else
      return `numeric(${this.precision})`;
  }
};
function numeric(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  const mode = config?.mode;
  return mode === "number" ? new PgNumericNumberBuilder(name, config?.precision, config?.scale) : mode === "bigint" ? new PgNumericBigIntBuilder(name, config?.precision, config?.scale) : new PgNumericBuilder(name, config?.precision, config?.scale);
}
var decimal = numeric;

// node_modules/drizzle-orm/pg-core/columns/point.js
var PgPointTupleBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgPointTupleBuilder";
  constructor(name) {
    super(name, "array point", "PgPointTuple");
  }
  build(table) {
    return new PgPointTuple(table, this.config);
  }
};
var PgPointTuple = class extends PgColumn {
  static [entityKind] = "PgPointTuple";
  codec = "point:tuple";
  mode = "tuple";
  getSQLType() {
    return "point";
  }
  mapToDriverValue = (value) => {
    return `(${value[0]},${value[1]})`;
  };
};
var PgPointObjectBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgPointObjectBuilder";
  constructor(name) {
    super(name, "object point", "PgPointObject");
  }
  build(table) {
    return new PgPointObject(table, this.config);
  }
};
var PgPointObject = class extends PgColumn {
  static [entityKind] = "PgPointObject";
  codec = "point";
  mode = "xy";
  getSQLType() {
    return "point";
  }
  mapToDriverValue = (value) => {
    return `(${value.x},${value.y})`;
  };
};
function point(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  if (!config?.mode || config.mode === "tuple")
    return new PgPointTupleBuilder(name);
  return new PgPointObjectBuilder(name);
}

// node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.js
var PgGeometryBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgGeometryBuilder";
  constructor(name, srid) {
    super(name, "array geometry", "PgGeometry");
    this.config.srid = srid;
  }
  build(table) {
    return new PgGeometry(table, this.config);
  }
};
var PgGeometry = class extends PgColumn {
  static [entityKind] = "PgGeometry";
  codec = "geometry(point):tuple";
  srid = this.config.srid;
  mode = "tuple";
  getSQLType() {
    return `geometry(point${this.srid === undefined ? "" : `,${this.srid}`})`;
  }
  mapToDriverValue = (value) => {
    return `point(${value[0]} ${value[1]})`;
  };
};
var PgGeometryObjectBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgGeometryObjectBuilder";
  constructor(name, srid) {
    super(name, "object geometry", "PgGeometryObject");
    this.config.srid = srid;
  }
  build(table) {
    return new PgGeometryObject(table, this.config);
  }
};
var PgGeometryObject = class extends PgColumn {
  static [entityKind] = "PgGeometryObject";
  codec = "geometry(point)";
  srid = this.config.srid;
  mode = "object";
  getSQLType() {
    return `geometry(point${this.srid === undefined ? "" : `,${this.srid}`})`;
  }
  mapToDriverValue = (value) => {
    return `point(${value.x} ${value.y})`;
  };
};
function geometry(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  if (!config?.mode || config.mode === "tuple")
    return new PgGeometryBuilder(name, config?.srid);
  return new PgGeometryObjectBuilder(name, config?.srid);
}

// node_modules/drizzle-orm/pg-core/columns/real.js
var PgRealBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgRealBuilder";
  constructor(name, length) {
    super(name, "number float", "PgReal");
    this.config.length = length;
  }
  build(table) {
    return new PgReal(table, this.config);
  }
};
var PgReal = class extends PgColumn {
  static [entityKind] = "PgReal";
  codec = "float4";
  constructor(table, config) {
    super(table, config);
  }
  getSQLType() {
    return "real";
  }
};
function real(name) {
  return new PgRealBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/serial.js
var PgSerialBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSerialBuilder";
  constructor(name) {
    super(name, "number int32", "PgSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  build(table) {
    return new PgSerial(table, this.config);
  }
};
var PgSerial = class extends PgColumn {
  static [entityKind] = "PgSerial";
  codec = "serial";
  getSQLType() {
    return "serial";
  }
};
function serial(name) {
  return new PgSerialBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/smallint.js
var PgSmallIntBuilder = class extends PgIntColumnBuilder {
  static [entityKind] = "PgSmallIntBuilder";
  constructor(name) {
    super(name, "number int16", "PgSmallInt");
  }
  build(table) {
    return new PgSmallInt(table, this.config);
  }
};
var PgSmallInt = class extends PgColumn {
  static [entityKind] = "PgSmallInt";
  codec = "smallint";
  getSQLType() {
    return "smallint";
  }
};
function smallint(name) {
  return new PgSmallIntBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/smallserial.js
var PgSmallSerialBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSmallSerialBuilder";
  constructor(name) {
    super(name, "number int16", "PgSmallSerial");
    this.config.hasDefault = true;
    this.config.notNull = true;
  }
  build(table) {
    return new PgSmallSerial(table, this.config);
  }
};
var PgSmallSerial = class extends PgColumn {
  static [entityKind] = "PgSmallSerial";
  codec = "smallserial";
  getSQLType() {
    return "smallserial";
  }
};
function smallserial(name) {
  return new PgSmallSerialBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/text.js
var PgTextBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgTextBuilder";
  constructor(name, config) {
    super(name, config.enum?.length ? "string enum" : "string", "PgText");
    this.config.enumValues = config.enum;
  }
  build(table) {
    return new PgText(table, this.config, this.config.enumValues);
  }
};
var PgText = class extends PgColumn {
  static [entityKind] = "PgText";
  enumValues;
  codec = "text";
  constructor(table, config, enumValues) {
    super(table, config);
    this.enumValues = enumValues;
  }
  getSQLType() {
    return "text";
  }
};
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgTextBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/time.js
var PgTimeBuilder = class extends PgDateColumnBuilder {
  static [entityKind] = "PgTimeBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "string time", "PgTime");
    this.withTimezone = withTimezone;
    this.precision = precision;
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  build(table) {
    return new PgTime(table, this.config);
  }
};
var PgTime = class extends PgColumn {
  static [entityKind] = "PgTime";
  codec = "time";
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
  }
  getSQLType() {
    return `time${this.precision === undefined ? "" : `(${this.precision})`}${this.withTimezone ? " with time zone" : ""}`;
  }
};
function time(a, b = {}) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
}

// node_modules/drizzle-orm/pg-core/columns/timestamp.js
var PgTimestampBuilder = class extends PgDateColumnBuilder {
  static [entityKind] = "PgTimestampBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "object date", "PgTimestamp");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  build(table) {
    return new PgTimestamp(table, this.config);
  }
};
var PgTimestamp = class extends PgColumn {
  static [entityKind] = "PgTimestamp";
  codec;
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
    this.codec = this.withTimezone ? "timestamptz" : "timestamp";
  }
  getSQLType() {
    return `timestamp${this.precision === undefined ? "" : ` (${this.precision})`}${this.withTimezone ? " with time zone" : ""}`;
  }
  mapToDriverValue = (value) => {
    if (typeof value === "string")
      return value;
    return value.toISOString();
  };
};
var PgTimestampStringBuilder = class extends PgDateColumnBuilder {
  static [entityKind] = "PgTimestampStringBuilder";
  constructor(name, withTimezone, precision) {
    super(name, "string timestamp", "PgTimestampString");
    this.config.withTimezone = withTimezone;
    this.config.precision = precision;
  }
  build(table) {
    return new PgTimestampString(table, this.config);
  }
};
var PgTimestampString = class extends PgColumn {
  static [entityKind] = "PgTimestampString";
  codec;
  withTimezone;
  precision;
  constructor(table, config) {
    super(table, config);
    this.withTimezone = config.withTimezone;
    this.precision = config.precision;
    this.codec = this.withTimezone ? "timestamptz:string" : "timestamp:string";
  }
  getSQLType() {
    return `timestamp${this.precision === undefined ? "" : `(${this.precision})`}${this.withTimezone ? " with time zone" : ""}`;
  }
  mapToDriverValue = (value) => {
    if (typeof value === "string")
      return value;
    return value.toISOString();
  };
};
function timestamp(a, b = {}) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  if (config?.mode === "string")
    return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
  return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
}

// node_modules/drizzle-orm/pg-core/columns/uuid.js
var PgUUIDBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgUUIDBuilder";
  constructor(name) {
    super(name, "string uuid", "PgUUID");
  }
  defaultRandom() {
    return this.default(sql`gen_random_uuid()`);
  }
  build(table) {
    return new PgUUID(table, this.config);
  }
};
var PgUUID = class extends PgColumn {
  static [entityKind] = "PgUUID";
  codec = "uuid";
  getSQLType() {
    return "uuid";
  }
};
function uuid(name) {
  return new PgUUIDBuilder(name ?? "");
}

// node_modules/drizzle-orm/pg-core/columns/varchar.js
var PgVarcharBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgVarcharBuilder";
  constructor(name, config) {
    super(name, config.enum?.length ? "string enum" : "string", "PgVarchar");
    this.config.length = config.length;
    this.config.enumValues = config.enum;
  }
  build(table) {
    return new PgVarchar(table, this.config);
  }
};
var PgVarchar = class extends PgColumn {
  static [entityKind] = "PgVarchar";
  codec = "varchar";
  enumValues;
  constructor(table, config) {
    super(table, config);
    this.enumValues = config.enumValues;
  }
  getSQLType() {
    return this.length === undefined ? `varchar` : `varchar(${this.length})`;
  }
};
function varchar(a, b = {}) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgVarcharBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.js
var PgBinaryVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgBinaryVectorBuilder";
  constructor(name, config) {
    super(name, "string binary", "PgBinaryVector");
    this.config.length = config.dimensions;
    this.config.isLengthExact = true;
  }
  build(table) {
    return new PgBinaryVector(table, this.config);
  }
};
var PgBinaryVector = class extends PgColumn {
  static [entityKind] = "PgBinaryVector";
  codec = "bit";
  getSQLType() {
    return `bit(${this.length})`;
  }
};
function bit(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgBinaryVectorBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.js
var PgHalfVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgHalfVectorBuilder";
  constructor(name, config) {
    super(name, "array halfvector", "PgHalfVector");
    this.config.length = config.dimensions;
    this.config.isLengthExact = true;
  }
  build(table) {
    return new PgHalfVector(table, this.config);
  }
};
var PgHalfVector = class extends PgColumn {
  static [entityKind] = "PgHalfVector";
  codec = "halfvec";
  getSQLType() {
    return `halfvec(${this.length})`;
  }
  mapToDriverValue = (value) => {
    return JSON.stringify(value);
  };
};
function halfvec(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgHalfVectorBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.js
var PgSparseVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgSparseVectorBuilder";
  constructor(name, config) {
    super(name, "string sparsevec", "PgSparseVector");
    this.config.vectorDimensions = config.dimensions;
  }
  build(table) {
    return new PgSparseVector(table, this.config);
  }
};
var PgSparseVector = class extends PgColumn {
  static [entityKind] = "PgSparseVector";
  codec = "sparsevec";
  vectorDimensions = this.config.vectorDimensions;
  getSQLType() {
    return `sparsevec(${this.vectorDimensions})`;
  }
};
function sparsevec(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgSparseVectorBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.js
var PgVectorBuilder = class extends PgColumnBuilder {
  static [entityKind] = "PgVectorBuilder";
  constructor(name, config) {
    super(name, "array vector", "PgVector");
    this.config.length = config.dimensions;
    this.config.isLengthExact = true;
  }
  build(table) {
    return new PgVector(table, this.config);
  }
};
var PgVector = class extends PgColumn {
  static [entityKind] = "PgVector";
  codec = "vector";
  getSQLType() {
    return `vector(${this.length})`;
  }
  mapToDriverValue = (value) => {
    return JSON.stringify(value);
  };
};
function vector(a, b) {
  const { name, config } = getColumnNameAndConfig2(a, b);
  return new PgVectorBuilder(name, config);
}

// node_modules/drizzle-orm/pg-core/columns/all.js
function getPgColumnBuilders() {
  return {
    bigint,
    bigserial,
    boolean,
    char,
    cidr,
    customType,
    date,
    doublePrecision,
    inet,
    integer,
    interval,
    json,
    jsonb,
    line,
    macaddr,
    macaddr8,
    numeric,
    point,
    geometry,
    real,
    serial,
    smallint,
    smallserial,
    text,
    time,
    timestamp,
    uuid,
    varchar,
    bit,
    halfvec,
    sparsevec,
    vector
  };
}

// node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
  return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((acc, word, i) => {
    return acc + (i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`);
  }, "");
}
function getCasingFn(casing) {
  if (casing === "snake_case")
    return toSnakeCase;
  if (casing === "camelCase")
    return toCamelCase;
  return (name) => name;
}

// node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
var EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends Table {
  static [entityKind] = "PgTable";
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys,
    EnableRLS
  });
  [InlineForeignKeys] = [];
  [EnableRLS] = false;
  [Table.Symbol.ExtraConfigBuilder] = undefined;
  [Table.Symbol.ExtraConfigColumns] = {};
};
function pgTableWithSchema(name, columns, extraConfig, schema, casing, baseName = name) {
  const casingFn = getCasingFn(casing);
  const rawTable = new PgTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getPgColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
    const colBuilder = colBuilderBase;
    colBuilder.setName(name, casingFn);
    const column = colBuilder.build(rawTable).postBuild();
    rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
    return [name, column];
  }));
  const builtColumnsForExtraConfig = Object.fromEntries(Object.entries(parsedColumns).map(([name, colBuilderBase]) => {
    const colBuilder = colBuilderBase;
    colBuilder.setName(name, casingFn);
    return [name, colBuilder.buildExtraConfigColumn(rawTable)];
  }));
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
  if (extraConfig)
    table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
  return Object.assign(table, { enableRLS: () => {
    table[PgTable.Symbol.EnableRLS] = true;
    return table;
  } });
}
function pgTableWithCasing(casing) {
  const pgTableInternal = (name, columns, extraConfig) => {
    return pgTableWithSchema(name, columns, extraConfig, undefined, casing);
  };
  const pgTableWithRLS = (name, columns, extraConfig) => {
    const table = pgTableWithSchema(name, columns, extraConfig, undefined, casing);
    table[EnableRLS] = true;
    return table;
  };
  return Object.assign(pgTableInternal, { withRLS: pgTableWithRLS });
}
var pgTable = pgTableWithCasing(undefined);

// node_modules/drizzle-orm/pg-core/indexes.js
var IndexBuilderOn = class {
  static [entityKind] = "PgIndexBuilderOn";
  constructor(unique, name) {
    this.unique = unique;
    this.name = name;
  }
  on(...columns) {
    return new IndexBuilder(columns.map((it) => {
      if (is(it, SQL))
        return it;
      if (is(it, ExtraConfigColumn)) {
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }
      it = it;
      return new IndexedColumn(it.name, !!it.keyAsName, it.columnType, {});
    }), this.unique, false, this.name);
  }
  onOnly(...columns) {
    return new IndexBuilder(columns.map((it) => {
      if (is(it, SQL))
        return it;
      if (is(it, ExtraConfigColumn)) {
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }
      it = it;
      return new IndexedColumn(it.name, !!it.keyAsName, it.columnType, {});
    }), this.unique, true, this.name);
  }
  using(method, ...columns) {
    return new IndexBuilder(columns.map((it) => {
      if (is(it, SQL))
        return it;
      if (is(it, ExtraConfigColumn)) {
        const clonedIndexedColumn = new IndexedColumn(it.name, !!it.keyAsName, it.columnType, it.indexConfig);
        it.indexConfig = JSON.parse(JSON.stringify(it.defaultConfig));
        return clonedIndexedColumn;
      }
      it = it;
      return new IndexedColumn(it.name, !!it.keyAsName, it.columnType, {});
    }), this.unique, true, this.name, method);
  }
};
var IndexBuilder = class {
  static [entityKind] = "PgIndexBuilder";
  config;
  constructor(columns, unique, only, name, method = "btree") {
    this.config = {
      name,
      columns,
      unique,
      only,
      method
    };
  }
  concurrently() {
    this.config.concurrently = true;
    return this;
  }
  with(obj) {
    this.config.with = obj;
    return this;
  }
  where(condition) {
    this.config.where = condition;
    return this;
  }
  build(table) {
    return new Index(this.config, table);
  }
};
var Index = class {
  static [entityKind] = "PgIndex";
  config;
  isNameExplicit;
  constructor(config, table) {
    this.config = {
      ...config,
      table
    };
    this.isNameExplicit = !!config.name;
  }
};
function index(name) {
  return new IndexBuilderOn(false, name);
}
function uniqueIndex(name) {
  return new IndexBuilderOn(true, name);
}

// node_modules/drizzle-orm/pg-core/utils.js
function extractUsedTable(table) {
  if (is(table, PgTable))
    return [table[TableSchema] ? `${table[TableSchema]}.${table[Table.Symbol.BaseName]}` : table[Table.Symbol.BaseName]];
  if (is(table, Subquery))
    return table._.usedTables ?? [];
  if (is(table, SQL))
    return table.usedTables ?? [];
  return [];
}

// node_modules/drizzle-orm/alias.js
var ColumnTableAliasProxyHandler2 = class {
  static [entityKind] = "ColumnTableAliasProxyHandler";
  constructor(table, ignoreColumnAlias) {
    this.table = table;
    this.ignoreColumnAlias = ignoreColumnAlias;
  }
  get(columnObj, prop) {
    if (prop === "table")
      return this.table;
    if (prop === "isAlias" && this.ignoreColumnAlias)
      return false;
    return columnObj[prop];
  }
};
var ViewSelectionAliasProxyHandler2 = class {
  static [entityKind] = "ViewSelectionAliasProxyHandler";
  constructor(view, selection, ignoreColumnAlias) {
    this.view = view;
    this.selection = selection;
    this.ignoreColumnAlias = ignoreColumnAlias;
  }
  get(selection, prop) {
    const value = selection[prop];
    if (is(value, Column))
      return new Proxy(value, new ColumnTableAliasProxyHandler2(this.view, this.ignoreColumnAlias));
    if (is(value, Subquery) || is(value, SQL) || is(value, SQL.Aliased) || isSQLWrapper(value) || typeof value !== "object" || value === null)
      return value;
    return new Proxy(value, this);
  }
};
var TableAliasProxyHandler2 = class {
  static [entityKind] = "TableAliasProxyHandler";
  constructor(alias, replaceOriginalName, ignoreColumnAlias) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
    this.ignoreColumnAlias = ignoreColumnAlias;
  }
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias)
      return true;
    if (prop === Table.Symbol.Name)
      return this.alias;
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName)
      return this.alias;
    if (prop === ViewBaseConfig)
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true,
        selectedFields: new Proxy(target[ViewBaseConfig].selectedFields, new ViewSelectionAliasProxyHandler2(new Proxy(target, this), target[ViewBaseConfig].selectedFields, this.ignoreColumnAlias))
      };
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns)
        return columns;
      if (is(target, View))
        return new Proxy(target[Table.Symbol.Columns], new ViewSelectionAliasProxyHandler2(new Proxy(target, this), target[Table.Symbol.Columns], this.ignoreColumnAlias));
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(columns[key], new ColumnTableAliasProxyHandler2(new Proxy(target, this), this.ignoreColumnAlias));
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column))
      return new Proxy(value, new ColumnTableAliasProxyHandler2(new Proxy(target, this), this.ignoreColumnAlias));
    return value;
  }
};
var ColumnAliasProxyHandler2 = class {
  static [entityKind] = "ColumnAliasProxyHandler";
  constructor(alias) {
    this.alias = alias;
  }
  get(target, prop) {
    if (prop === "isAlias")
      return true;
    if (prop === "name")
      return this.alias;
    if (prop === "keyAsName")
      return false;
    if (prop === OriginalColumn)
      return () => target;
    return target[prop];
  }
};
function aliasedTable2(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler2(tableAlias, false, false));
}
function aliasedColumn2(column, alias) {
  return new Proxy(column, new ColumnAliasProxyHandler2(alias));
}
Column.prototype.as = function(alias) {
  return aliasedColumn2(this, alias);
};
function getOriginalColumnFromAlias2(column) {
  return column[OriginalColumn]();
}

// node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class SelectionProxyHandler {
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config) {
    this.config = { ...config };
  }
  get(subquery, prop) {
    if (prop === "_")
      return {
        ...subquery["_"],
        selectedFields: new Proxy(subquery._.selectedFields, this)
      };
    if (prop === ViewBaseConfig)
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(subquery[ViewBaseConfig].selectedFields, this)
      };
    if (typeof prop === "symbol")
      return subquery[prop];
    const value = (is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery)[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField)
        return value.sql;
      const newValue = value.clone();
      newValue.isSelectionField = true;
      newValue.origin = this.config.alias;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql")
        return value;
      throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
    }
    if (is(value, Column)) {
      if (this.config.alias)
        return new Proxy(value, new ColumnTableAliasProxyHandler2(new Proxy(value.table, new TableAliasProxyHandler2(this.config.alias, this.config.replaceOriginalName ?? false, true)), true));
      return value;
    }
    if (typeof value !== "object" || value === null)
      return value;
    return new Proxy(value, new SelectionProxyHandler(this.config));
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/delete.js
var PgDeleteBase = class {
  static [entityKind] = "PgDelete";
  config;
  constructor(table, session, dialect, withList) {
    this.session = session;
    this.dialect = dialect;
    this.config = {
      table,
      withList
    };
  }
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields2(fields, undefined, this.dialect.codecs);
    return this;
  }
  comment(comment) {
    this.config.comment = sql.comment(comment);
    return this;
  }
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    return this.dialect.sqlToQuery(this.getSQL());
  }
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(this.config.returningFields, new SelectionProxyHandler({
      alias: getTableName(this.config.table),
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    })) : undefined;
  }
  withoutSelectionCastCodecs() {
    this.config.ignoreSelectionCastCodecs = true;
    return this;
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/pg-core/async/delete.js
var PgAsyncDeleteBase = class extends PgDeleteBase {
  static [entityKind] = "PgAsyncDelete";
  _prepare(name, generateName = false) {
    const { session, config, dialect } = this;
    const { returning: fields } = config;
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const query = dialect.sqlToQuery(this.getSQL());
      const mapper = fields ? this.dialect.mapperGenerators.rows(fields, undefined) : undefined;
      return session.prepareQuery(query, fields ? "arrays" : "raw", name ?? generateName, mapper, {
        type: "delete",
        tables: [...extractUsedTable(this.config.table)]
      });
    });
  }
  prepare(name) {
    return this._prepare(name, true);
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  };
};
applyMixins2(PgAsyncDeleteBase, [QueryPromise2]);

// node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
  static [entityKind] = "TypedQueryBuilder";
  getSelectedFields() {
    return this._.selectedFields;
  }
  withoutSelectionCastCodecs() {
    return this;
  }
};

// node_modules/drizzle-orm/pg-core/view-base.js
var PgViewBase = class extends View {
  static [entityKind] = "PgViewBase";
};

// node_modules/drizzle-orm/pg-core/query-builders/select.js
var PgSelectBuilder = class {
  static [entityKind] = "PgSelectBuilder";
  fields;
  session;
  dialect;
  withList = [];
  distinct;
  tagged;
  constructor(config, builder = PgSelectBase) {
    this.builder = builder;
    this.fields = config.fields;
    this.session = config.session;
    this.dialect = config.dialect;
    if (config.withList)
      this.withList = config.withList;
    this.distinct = config.distinct;
  }
  from(source) {
    const isPartialSelect = !!this.fields;
    const src = source;
    let fields;
    if (this.fields)
      fields = this.fields;
    else if (is(src, Subquery))
      fields = Object.fromEntries(Object.keys(src._.selectedFields).map((key) => [key, src[key]]));
    else if (is(src, PgViewBase))
      fields = src[ViewBaseConfig].selectedFields;
    else if (is(src, SQL))
      fields = {};
    else
      fields = getTableColumns2(src);
    return new this.builder({
      table: src,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
};
var PgSelectBase = class extends TypedQueryBuilder {
  static [entityKind] = "PgSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  cacheConfig;
  usedTables = /* @__PURE__ */ new Set;
  constructor(config) {
    super();
    this.session = config.session;
    this.dialect = config.dialect;
    this.config = {
      withList: config.withList,
      table: config.table,
      fields: { ...config.fields },
      distinct: config.distinct,
      setOperators: []
    };
    this.isPartialSelect = config.isPartialSelect;
    this._ = {
      selectedFields: this.config.fields,
      config: this.config
    };
    this.tableName = getTableLikeName2(config.table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
    for (const item of extractUsedTable(config.table))
      this.usedTables.add(item);
    this.config.withList?.forEach((it) => {
      const extracted = extractUsedTable(it);
      for (const el of extracted)
        this.usedTables.add(el);
    });
  }
  getUsedTables() {
    return [...this.usedTables];
  }
  createJoin(joinType, lateral) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName2(table);
      for (const item of extractUsedTable(table))
        this.usedTables.add(item);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName))
        throw new Error(`Alias "${tableName}" is already used in this query`);
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string")
          this.config.fields = { [baseTableName]: this.config.fields };
        if (typeof tableName === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function")
        on = on(new Proxy(this.config.fields, new SelectionProxyHandler({
          sqlAliasedBehavior: "sql",
          sqlBehavior: "sql"
        })));
      if (!this.config.joins)
        this.config.joins = [];
      this.config.joins.push({
        on,
        table,
        joinType,
        alias: tableName,
        lateral
      });
      if (typeof tableName === "string")
        switch (joinType) {
          case "left":
            this.joinsNotNullableMap[tableName] = false;
            break;
          case "right":
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = true;
            break;
          case "cross":
          case "inner":
            this.joinsNotNullableMap[tableName] = true;
            break;
          case "full":
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = false;
            break;
        }
      return this;
    };
  }
  leftJoin = this.createJoin("left", false);
  leftJoinLateral = this.createJoin("left", true);
  rightJoin = this.createJoin("right", false);
  innerJoin = this.createJoin("inner", false);
  innerJoinLateral = this.createJoin("inner", true);
  fullJoin = this.createJoin("full", false);
  crossJoin = this.createJoin("cross", false);
  crossJoinLateral = this.createJoin("cross", true);
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getPgSetOperators()) : rightSelection;
      if (!haveSameKeys2(this.getSelectedFields(), rightSelect.getSelectedFields()))
        throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
      this.config.setOperators.push({
        type,
        isAll,
        rightSelect
      });
      return this;
    };
  }
  union = this.createSetOperator("union", false);
  unionAll = this.createSetOperator("union", true);
  intersect = this.createSetOperator("intersect", false);
  intersectAll = this.createSetOperator("intersect", true);
  except = this.createSetOperator("except", false);
  exceptAll = this.createSetOperator("except", true);
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  where(where) {
    if (typeof where === "function")
      where = where(new Proxy(this.config.fields, new SelectionProxyHandler({
        sqlAliasedBehavior: "sql",
        sqlBehavior: "sql"
      })));
    this.config.where = where;
    return this;
  }
  having(having) {
    if (typeof having === "function")
      having = having(new Proxy(this.config.fields, new SelectionProxyHandler({
        sqlAliasedBehavior: "sql",
        sqlBehavior: "sql"
      })));
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({
        sqlAliasedBehavior: "alias",
        sqlBehavior: "sql"
      })));
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else
      this.config.groupBy = columns;
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({
        sqlAliasedBehavior: "alias",
        sqlBehavior: "sql"
      })));
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0)
        this.config.setOperators.at(-1).orderBy = orderByArray;
      else
        this.config.orderBy = orderByArray;
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0)
        this.config.setOperators.at(-1).orderBy = orderByArray;
      else
        this.config.orderBy = orderByArray;
    }
    return this;
  }
  limit(limit) {
    if (this.config.setOperators.length > 0)
      this.config.setOperators.at(-1).limit = limit;
    else
      this.config.limit = limit;
    return this;
  }
  offset(offset) {
    if (this.config.setOperators.length > 0)
      this.config.setOperators.at(-1).offset = offset;
    else
      this.config.offset = offset;
    return this;
  }
  for(strength, config = {}) {
    this.config.lockingClause = {
      strength,
      config
    };
    return this;
  }
  comment(comment) {
    this.config.comment = sql.comment(comment);
    return this;
  }
  getSQL() {
    this.config.fieldsFlat = orderSelectedFields2(this.config.fields, undefined, this.dialect.codecs);
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    return this.dialect.sqlToQuery(this.getSQL());
  }
  as(alias) {
    const usedTables = [];
    usedTables.push(...extractUsedTable(this.config.table));
    if (this.config.joins)
      for (const it of this.config.joins)
        usedTables.push(...extractUsedTable(it.table));
    return new Proxy(new Subquery(this.withoutSelectionCastCodecs().getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]), new SelectionProxyHandler({
      alias,
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    }));
  }
  getSelectedFields() {
    return new Proxy(this.config.fields, new SelectionProxyHandler({
      alias: this.tableName,
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    }));
  }
  withoutSelectionCastCodecs() {
    this.config.ignoreSelectionCastCodecs = true;
    return this;
  }
  $dynamic() {
    return this;
  }
  $withCache(config) {
    this.cacheConfig = config === undefined ? {
      config: {},
      enabled: true,
      autoInvalidate: true
    } : config === false ? { enabled: false } : {
      enabled: true,
      autoInvalidate: true,
      ...config
    };
    return this;
  }
};
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators)
      if (!haveSameKeys2(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields()))
        throw new Error("Set operator error (union / intersect / except): selected fields are not the same or are in a different order");
    return leftSelect.addSetOperators(setOperators);
  };
}
var getPgSetOperators = () => ({
  union,
  unionAll,
  intersect,
  intersectAll,
  except,
  exceptAll
});
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var intersectAll = createSetOperator("intersect", true);
var except = createSetOperator("except", false);
var exceptAll = createSetOperator("except", true);

// node_modules/drizzle-orm/errors.js
var DrizzleError2 = class extends Error {
  static [entityKind] = "DrizzleError";
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
};
var DrizzleQueryError2 = class DrizzleQueryError extends Error {
  static [entityKind] = "DrizzleQueryError";
  constructor(query, params, cause) {
    super(`Failed query: ${query}
params: ${params}`);
    this.query = query;
    this.params = params;
    this.cause = cause;
    this.name = "DrizzleQueryError";
    Error.captureStackTrace(this, DrizzleQueryError);
    if (cause)
      this.cause = cause;
  }
};
var TransactionRollbackError2 = class extends DrizzleError2 {
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super({ message: "Rollback" });
    this.name = "TransactionRollbackError";
  }
};
// node_modules/drizzle-orm/relations.js
var Relation2 = class {
  static [entityKind] = "RelationV2";
  fieldName;
  sourceColumns;
  targetColumns;
  alias;
  where;
  sourceTable;
  targetTable;
  through;
  throughTable;
  isReversed;
  sourceColumnTableNames = [];
  targetColumnTableNames = [];
  constructor(targetTable, targetTableName) {
    this.targetTableName = targetTableName;
    this.targetTable = targetTable;
  }
};
var One2 = class extends Relation2 {
  static [entityKind] = "OneV2";
  relationType = "one";
  optional;
  constructor(tables, targetTable, targetTableName, config) {
    super(targetTable, targetTableName);
    this.alias = config?.alias;
    this.where = config?.where;
    if (config?.from)
      this.sourceColumns = (Array.isArray(config.from) ? config.from : [config.from]).map((it) => {
        this.throughTable ??= it._.through ? tables[it._.through._.tableName] : undefined;
        this.sourceColumnTableNames.push(it._.tableName);
        return it._.column;
      });
    if (config?.to)
      this.targetColumns = (Array.isArray(config.to) ? config.to : [config.to]).map((it) => {
        this.throughTable ??= it._.through ? tables[it._.through._.tableName] : undefined;
        this.targetColumnTableNames.push(it._.tableName);
        return it._.column;
      });
    if (this.throughTable)
      this.through = {
        source: (Array.isArray(config?.from) ? config.from : (config?.from) ? [config.from] : []).map((c) => c._.through),
        target: (Array.isArray(config?.to) ? config.to : (config?.to) ? [config.to] : []).map((c) => c._.through)
      };
    this.optional = config?.optional ?? true;
  }
};
var operators2 = {
  and,
  between,
  eq,
  exists,
  gt,
  gte,
  ilike,
  inArray,
  arrayContains,
  arrayContained,
  arrayOverlaps,
  isNull,
  isNotNull,
  like,
  lt,
  lte,
  ne,
  not,
  notBetween,
  notExists,
  notLike,
  notIlike,
  notInArray,
  or,
  sql
};
var orderByOperators2 = {
  sql,
  asc,
  desc
};
function mapRelationalRow2(rows, isOne, buildQueryResultSelection, parseJson = false, parseJsonIfString = false, useJsonMappers = true) {
  const maxIdx = isOne ? 1 : rows.length;
  const decoders = buildQueryResultSelection.map(({ field, codec, arrayDimensions }) => {
    let decoder;
    if (is(field, Column))
      decoder = field;
    else if (is(field, SQL))
      decoder = field.decoder;
    else if (is(field, SQL.Aliased))
      decoder = field.sql.decoder;
    else if (is(field, Table) || is(field, View))
      decoder = noopDecoder;
    else
      decoder = field.getSQL().decoder;
    if (useJsonMappers && field.mapFromJsonValue)
      return (v) => field.mapFromJsonValue(v);
    return decoder.mapFromDriverValue.isNoop ? codec ? (value) => codec(value, arrayDimensions) : undefined : codec ? (value) => decoder.mapFromDriverValue(codec(value, arrayDimensions)) : (value) => decoder.mapFromDriverValue(value);
  });
  for (let i = 0;i < maxIdx; ++i) {
    const row = isOne ? rows : rows[i];
    for (let selectionItemIdx = 0;selectionItemIdx < buildQueryResultSelection.length; ++selectionItemIdx) {
      const selectionItem = buildQueryResultSelection[selectionItemIdx];
      if (selectionItem.selection) {
        if (row[selectionItem.key] === null)
          continue;
        if (parseJson) {
          row[selectionItem.key] = JSON.parse(row[selectionItem.key]);
          if (row[selectionItem.key] === null)
            continue;
        } else if (parseJsonIfString && typeof row[selectionItem.key] === "string")
          row[selectionItem.key] = JSON.parse(row[selectionItem.key]);
        if (selectionItem.isArray) {
          mapRelationalRow2(row[selectionItem.key], false, selectionItem.selection, false, parseJsonIfString);
          continue;
        }
        mapRelationalRow2(row[selectionItem.key], true, selectionItem.selection, false, parseJsonIfString);
        continue;
      }
      if (row[selectionItem.key] === null)
        continue;
      const decoder = decoders[selectionItemIdx];
      if (!decoder)
        continue;
      row[selectionItem.key] = decoder(row[selectionItem.key]);
    }
  }
  return rows;
}
function mapRelationalRowFromArrays2(rows, isOne, buildQueryResultSelection, parseJson = false, parseJsonIfString = false) {
  const maxIdx = isOne ? 1 : rows.length;
  const decoders = buildQueryResultSelection.map(({ field, codec, arrayDimensions }) => {
    let decoder;
    if (is(field, Column))
      decoder = field;
    else if (is(field, SQL))
      decoder = field.decoder;
    else if (is(field, SQL.Aliased))
      decoder = field.sql.decoder;
    else if (is(field, Table) || is(field, View))
      decoder = noopDecoder;
    else
      decoder = field.getSQL().decoder;
    return decoder.mapFromDriverValue.isNoop ? codec ? (value) => codec(value, arrayDimensions) : undefined : codec ? (value) => decoder.mapFromDriverValue(codec(value, arrayDimensions)) : (value) => decoder.mapFromDriverValue(value);
  });
  const results = Array.from({ length: maxIdx });
  for (let i = 0;i < maxIdx; ++i) {
    const row = isOne ? rows : rows[i];
    const result = {};
    for (let selectionItemIdx = 0;selectionItemIdx < buildQueryResultSelection.length; ++selectionItemIdx) {
      const selectionItem = buildQueryResultSelection[selectionItemIdx];
      let value = row[selectionItemIdx];
      if (selectionItem.selection) {
        if (value === null) {
          result[selectionItem.key] = null;
          continue;
        }
        if (parseJson) {
          value = JSON.parse(value);
          if (value === null) {
            result[selectionItem.key] = null;
            continue;
          }
        } else if (parseJsonIfString && typeof value === "string")
          value = JSON.parse(value);
        if (selectionItem.isArray)
          mapRelationalRow2(value, false, selectionItem.selection, false, parseJsonIfString);
        else
          mapRelationalRow2(value, true, selectionItem.selection, false, parseJsonIfString);
        result[selectionItem.key] = value;
        continue;
      }
      if (value === null) {
        result[selectionItem.key] = null;
        continue;
      }
      const decoder = decoders[selectionItemIdx];
      result[selectionItem.key] = decoder ? decoder(value) : value;
    }
    results[i] = result;
  }
  return isOne ? results[0] : results;
}
function makeDefaultRqbMapper2({ selection, isFirst, parseJson, parseJsonIfString, rootJsonMappers, arrayModeRoot }) {
  return (rows) => {
    if (isFirst && !rows[0])
      return rows[0];
    return arrayModeRoot ? mapRelationalRowFromArrays2(isFirst ? rows[0] : rows, isFirst, selection, parseJson, parseJsonIfString) : mapRelationalRow2(isFirst ? rows[0] : rows, isFirst, selection, parseJson, parseJsonIfString, rootJsonMappers);
  };
}
function makeJitRqbMapperInner(selection, rowExpr, selectionVar, parseJson, parseJsonIfString, useJsonMappers, preFn, counter, accessByIdx) {
  const bodyStmts = [];
  const literalEntries = [];
  let hasWork = false;
  const fieldVars = selection.map(() => `c${counter.n++}`);
  const destructurePieces = selection.map((item, idx) => accessByIdx ? fieldVars[idx] : `${JSON.stringify(item.key)}: ${fieldVars[idx]}`);
  bodyStmts.push(accessByIdx ? `let [ ${destructurePieces.join(", ")} ] = ${rowExpr};` : `let { ${destructurePieces.join(", ")} } = ${rowExpr};`);
  for (const [idx, { field, key, codec, isArray, selection: innerSelection, arrayDimensions }] of selection.entries()) {
    const sel = `${selectionVar}[${idx}]`;
    const keyStr = JSON.stringify(key);
    const slot = fieldVars[idx];
    if (innerSelection) {
      if (parseJson) {
        bodyStmts.push(`if (${slot} !== null) ${slot} = JSON.parse(${slot});`);
        hasWork = true;
      } else if (parseJsonIfString) {
        bodyStmts.push(`if (typeof ${slot} === 'string') ${slot} = JSON.parse(${slot});`);
        hasWork = true;
      }
      const nestedSelVar = `s${counter.n++}`;
      const savedPreFnLen = preFn.length;
      preFn.push(`const { selection: ${nestedSelVar} } = ${sel};`);
      if (isArray) {
        const j = `j${counter.n++}`;
        const inner = makeJitRqbMapperInner(innerSelection, `${slot}[${j}]`, nestedSelVar, false, parseJsonIfString, true, preFn, counter, false);
        if (inner.hasWork) {
          hasWork = true;
          bodyStmts.push(`if (${slot} !== null) {`);
          bodyStmts.push(`	for (let ${j} = 0; ${j} < ${slot}.length; ++${j}) {`);
          for (const s of inner.bodyStmts)
            bodyStmts.push(`		${s}`);
          bodyStmts.push(`		${slot}[${j}] = ${inner.literal};`);
          bodyStmts.push(`	}`);
          bodyStmts.push(`}`);
        } else
          preFn.splice(savedPreFnLen, 1);
      } else {
        const inner = makeJitRqbMapperInner(innerSelection, slot, nestedSelVar, false, parseJsonIfString, true, preFn, counter, false);
        if (inner.hasWork) {
          hasWork = true;
          bodyStmts.push(`if (${slot} !== null) {`);
          for (const s of inner.bodyStmts)
            bodyStmts.push(`	${s}`);
          bodyStmts.push(`	${slot} = ${inner.literal};`);
          bodyStmts.push(`}`);
        } else
          preFn.splice(savedPreFnLen, 1);
      }
      literalEntries.push(`${keyStr}: ${slot}`);
      continue;
    }
    let decoderExpr = "";
    let destructure = "";
    let bypassCodecs = false;
    if (is(field, Column)) {
      if (useJsonMappers && field.mapFromJsonValue) {
        bypassCodecs = true;
        const id = counter.n++;
        destructure = `field: dec${id}`;
        decoderExpr = `dec${id}.mapFromJsonValue`;
      } else if (!field.mapFromDriverValue.isNoop) {
        const id = counter.n++;
        destructure = `field: dec${id}`;
        decoderExpr = `dec${id}.mapFromDriverValue`;
      }
    } else if (is(field, SQL)) {
      if (useJsonMappers && field.decoder.mapFromJsonValue) {
        bypassCodecs = true;
        const id = counter.n++;
        destructure = `field: { decoder: dec${id} }`;
        decoderExpr = `dec${id}.mapFromJsonValue`;
      } else if (!field.decoder.mapFromDriverValue.isNoop) {
        const id = counter.n++;
        destructure = `field: { decoder: dec${id} }`;
        decoderExpr = `dec${id}.mapFromDriverValue`;
      }
    } else if (is(field, SQL.Aliased)) {
      if (useJsonMappers && field.sql.decoder.mapFromJsonValue) {
        bypassCodecs = true;
        const id = counter.n++;
        destructure = `field: { sql: { decoder: dec${id} } }`;
        decoderExpr = `dec${id}.mapFromJsonValue`;
      } else if (!field.sql.decoder.mapFromDriverValue.isNoop) {
        const id = counter.n++;
        destructure = `field: { sql: { decoder: dec${id} } }`;
        decoderExpr = `dec${id}.mapFromDriverValue`;
      }
    } else if (is(field, Table) || is(field, View)) {} else {
      const sqlExpr = field.getSQL();
      if (useJsonMappers && sqlExpr.decoder.mapFromJsonValue) {
        bypassCodecs = true;
        const id = counter.n++;
        preFn.push(`const dec${id} = ${sel}.field.getSQL().decoder;`);
        decoderExpr = `dec${id}.mapFromJsonValue`;
      } else if (!sqlExpr.decoder.mapFromDriverValue.isNoop) {
        const id = counter.n++;
        preFn.push(`const dec${id} = ${sel}.field.getSQL().decoder;`);
        decoderExpr = `dec${id}.mapFromDriverValue`;
      }
    }
    let codecVar = "";
    if (!bypassCodecs && codec)
      codecVar = `codec${counter.n++}`;
    if (destructure || codecVar) {
      const parts = [];
      if (destructure)
        parts.push(destructure);
      if (codecVar)
        parts.push(`codec: ${codecVar}`);
      preFn.push(`const { ${parts.join(", ")} } = ${sel};`);
    }
    if (decoderExpr || codecVar) {
      hasWork = true;
      let decoded = slot;
      if (codecVar)
        decoded = `${codecVar}(${decoded}, ${arrayDimensions})`;
      if (decoderExpr)
        decoded = `${decoderExpr}(${decoded})`;
      literalEntries.push(`${keyStr}: ${slot} === null ? null : ${decoded}`);
    } else
      literalEntries.push(`${keyStr}: ${slot}`);
  }
  return {
    bodyStmts,
    literal: `{ ${literalEntries.join(", ")} }`,
    hasWork
  };
}
function makeJitRqbMapper2({ selection, isFirst, parseJson, parseJsonIfString, rootJsonMappers, arrayModeRoot }) {
  const preFn = [];
  const inner = makeJitRqbMapperInner(selection, "row", "selection", parseJson, parseJsonIfString, arrayModeRoot ? false : rootJsonMappers, preFn, { n: 0 }, !!arrayModeRoot);
  const lines = [];
  lines.push(`	"use strict";
	const { selection } = this;`);
  for (const p of preFn)
    lines.push(`	${p}`);
  if (arrayModeRoot)
    if (isFirst) {
      lines.push(`	const row = rows[0];`);
      lines.push(`	if (!row) return undefined;`);
      for (const s of inner.bodyStmts)
        lines.push(`	${s}`);
      lines.push(`	return ${inner.literal};`);
    } else {
      lines.push(`	const { length } = rows;`);
      lines.push(`	const mapped = Array.from({ length });`);
      lines.push(`	for (let i = 0; i < length; ++i) {`);
      lines.push(`		const row = rows[i];`);
      for (const s of inner.bodyStmts)
        lines.push(`		${s}`);
      lines.push(`		mapped[i] = ${inner.literal};`);
      lines.push(`	}`);
      lines.push(`	return mapped;`);
    }
  else if (!inner.hasWork)
    lines.push(isFirst ? `	return rows[0];` : `	return rows;`);
  else if (isFirst) {
    lines.push(`	const row = rows[0];`);
    lines.push(`	if (!row) return undefined;`);
    for (const s of inner.bodyStmts)
      lines.push(`	${s}`);
    lines.push(`	rows[0] = ${inner.literal};`);
    lines.push(`	return rows[0];`);
  } else {
    lines.push(`	for (let i = 0; i < rows.length; ++i) {`);
    lines.push(`		const row = rows[i];`);
    for (const s of inner.bodyStmts)
      lines.push(`		${s}`);
    lines.push(`		rows[i] = ${inner.literal};`);
    lines.push(`	}`);
    lines.push(`	return rows;`);
  }
  lines.push("\t//# sourceURL=drizzle:jit-relational-query-mapper");
  const compiled = lines.join(`
`);
  return Object.assign(new FnConstructor2("rows", compiled).bind({ selection }), { body: `function jitRqbMapper (rows) {
${compiled}
}` });
}
function fieldSelectionToSQL2(table, target) {
  const field = table[TableColumns][target];
  return field ? is(field, Column) ? field : is(field, SQL.Aliased) ? sql`${table}.${sql.identifier(field.fieldAlias)}` : sql`${table}.${sql.identifier(target)}` : sql`${table}.${sql.identifier(target)}`;
}
function relationsFieldFilterToSQL(column, filter) {
  if (typeof filter !== "object" || is(filter, Placeholder))
    return eq(column, filter);
  const entries = Object.entries(filter);
  if (!entries.length)
    return;
  const parts = [];
  for (const [target, value] of entries) {
    if (value === undefined)
      continue;
    switch (target) {
      case "NOT": {
        const res = relationsFieldFilterToSQL(column, value);
        if (!res)
          continue;
        parts.push(not(res));
        continue;
      }
      case "OR":
        if (!value.length)
          continue;
        parts.push(or(...value.map((subFilter) => relationsFieldFilterToSQL(column, subFilter))));
        continue;
      case "AND":
        if (!value.length)
          continue;
        parts.push(and(...value.map((subFilter) => relationsFieldFilterToSQL(column, subFilter))));
        continue;
      case "isNotNull":
      case "isNull":
        if (!value)
          continue;
        parts.push(operators2[target](column));
        continue;
      case "in":
        parts.push(operators2.inArray(column, value));
        continue;
      case "notIn":
        parts.push(operators2.notInArray(column, value));
        continue;
      default:
        parts.push(operators2[target](column, value));
        continue;
    }
  }
  if (!parts.length)
    return;
  return and(...parts);
}
function relationsFilterToSQL2(table, filter, tableRelations = {}, tablesRelations = {}, depth = 0) {
  const entries = Object.entries(filter);
  if (!entries.length)
    return;
  const parts = [];
  for (const [target, value] of entries) {
    if (value === undefined)
      continue;
    switch (target) {
      case "RAW": {
        const processed = typeof value === "function" ? value(table, operators2) : value.getSQL();
        parts.push(processed);
        continue;
      }
      case "OR":
        if (!value?.length)
          continue;
        parts.push(or(...value.map((subFilter) => relationsFilterToSQL2(table, subFilter, tableRelations, tablesRelations, depth))));
        continue;
      case "AND":
        if (!value?.length)
          continue;
        parts.push(and(...value.map((subFilter) => relationsFilterToSQL2(table, subFilter, tableRelations, tablesRelations, depth))));
        continue;
      case "NOT": {
        if (value === undefined)
          continue;
        const built = relationsFilterToSQL2(table, value, tableRelations, tablesRelations, depth);
        if (!built)
          continue;
        parts.push(not(built));
        continue;
      }
      default: {
        if (table[TableColumns][target]) {
          const colFilter = relationsFieldFilterToSQL(fieldSelectionToSQL2(table, target), value);
          if (colFilter)
            parts.push(colFilter);
          continue;
        }
        const relation = tableRelations[target];
        if (!relation)
          throw new DrizzleError2({ message: `Unknown relational filter field: "${target}"` });
        const targetTable = aliasedTable2(relation.targetTable, `f${depth}`);
        const throughTable = relation.throughTable ? aliasedTable2(relation.throughTable, `ft${depth}`) : undefined;
        const targetConfig = tablesRelations[relation.targetTableName];
        const { filter: relationFilter, joinCondition } = relationToSQL2(relation, table, targetTable, throughTable);
        const filter = and(relationFilter, typeof value === "boolean" ? undefined : relationsFilterToSQL2(targetTable, value, targetConfig.relations, tablesRelations, depth + 1));
        const subquery = throughTable ? sql`(select * from ${getTableAsAliasSQL2(targetTable)} inner join ${getTableAsAliasSQL2(throughTable)} on ${joinCondition}${sql` where ${filter}`.if(filter)} limit 1)` : sql`(select * from ${getTableAsAliasSQL2(targetTable)}${sql` where ${filter}`.if(filter)} limit 1)`;
        if (filter)
          parts.push((value ? exists : notExists)(subquery));
      }
    }
  }
  return and(...parts);
}
function relationsOrderToSQL2(table, orders) {
  if (typeof orders === "function") {
    const data = orders(table, orderByOperators2);
    return is(data, SQL) ? data : Array.isArray(data) ? data.length ? sql.join(data.map((o) => is(o, SQL) ? o : asc(o)), sql`, `) : undefined : is(data, Column) ? asc(data) : undefined;
  }
  const entries = Object.entries(orders).filter(([_, value]) => value);
  if (!entries.length)
    return;
  return sql.join(entries.map(([target, value]) => (value === "asc" ? asc : desc)(fieldSelectionToSQL2(table, target))), sql`, `);
}
function relationExtrasToSQL2(table, extras, codecs, inJson) {
  const subqueries = [];
  const selection = [];
  for (const [key, field] of Object.entries(extras)) {
    if (!field)
      continue;
    const subq = (typeof field === "function" ? field(table, { sql: operators2.sql }) : field).getSQL();
    const column = codecs ? getColumnFromDecoder2(subq) : undefined;
    const query = column && (!inJson || !column.jsonSelectIdentifier) ? sql`${codecs.apply(column, inJson ? "castInJson" : "cast", sql`(${subq})`)} as ${sql.identifier(key)}` : sql`(${subq}) as ${sql.identifier(key)}`;
    query.decoder = subq.decoder;
    subqueries.push(query);
    selection.push(column && (!inJson || !column.mapFromJsonValue) ? {
      key,
      field: query,
      codec: codecs.get(column, inJson ? "normalizeInJson" : "normalize"),
      arrayDimensions: column.dimensions
    } : {
      key,
      field: query
    });
  }
  return {
    sql: subqueries.length ? sql.join(subqueries, sql`, `) : undefined,
    selection
  };
}
function relationToSQL2(relation, sourceTable, targetTable, throughTable) {
  if (relation.through) {
    const outerColumnWhere = relation.sourceColumns.map((s, i) => {
      const t = relation.through.source[i];
      return eq(sql`${sourceTable}.${sql.identifier(s.name)}`, sql`${throughTable}.${sql.identifier(is(t._.column, Column) ? t._.column.name : t._.key)}`);
    });
    const innerColumnWhere = relation.targetColumns.map((s, i) => {
      const t = relation.through.target[i];
      return eq(sql`${throughTable}.${sql.identifier(is(t._.column, Column) ? t._.column.name : t._.key)}`, sql`${targetTable}.${sql.identifier(s.name)}`);
    });
    return {
      filter: and(relation.where ? relationsFilterToSQL2(relation.isReversed ? sourceTable : targetTable, relation.where) : undefined, ...outerColumnWhere),
      joinCondition: and(...innerColumnWhere)
    };
  }
  return { filter: and(...relation.sourceColumns.map((s, i) => {
    const t = relation.targetColumns[i];
    return eq(sql`${sourceTable}.${sql.identifier(s.name)}`, sql`${targetTable}.${sql.identifier(t.name)}`);
  }), relation.where ? relationsFilterToSQL2(relation.isReversed ? sourceTable : targetTable, relation.where) : undefined) };
}
function getTableAsAliasSQL2(table) {
  return sql`${table[IsAlias] ? sql`${sql`${sql.identifier(table[TableSchema] ?? "")}.`.if(table[TableSchema])}${sql.identifier(table[OriginalName])} as ${table}` : table}`;
}
// node_modules/drizzle-orm/pg-core/dialect.js
var PgDialect = class {
  static [entityKind] = "PgDialect";
  codecs;
  mapperGenerators;
  constructor(config) {
    this.codecs = new CodecsCollection(resolvePgTypeAlias, config?.codecs);
    this.mapperGenerators = config?.useJitMappers ? {
      rows: makeJitQueryMapper2,
      relationalRows: makeJitRqbMapper2
    } : {
      rows: makeDefaultQueryMapper2,
      relationalRows: makeDefaultRqbMapper2
    };
  }
  escapeName(name) {
    return `"${name.replace(/"/g, '""')}"`;
  }
  escapeParam(num) {
    return `$${num + 1}`;
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length)
      return;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1)
        withSqlChunks.push(sql`, `);
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList, comment, ignoreSelectionCastCodecs }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
      isSingleTable: true,
      ignoreCastCodecs: ignoreSelectionCastCodecs
    })}` : undefined;
    return sql`${withSql}delete from ${table}${where ? sql` where ${where}` : undefined}${returningSql}${comment !== undefined ? sql` ${comment}` : undefined}`;
  }
  buildUpdateSet(table, set) {
    const tableColumns = table[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter((colName) => set[colName] !== undefined || tableColumns[colName]?.onUpdateFn !== undefined);
    const setLength = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const onUpdateFnResult = col.onUpdateFn?.();
      const value = set[colName] ?? (is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col));
      const res = sql`${sql.identifier(col.name)} = ${value}`;
      if (i < setLength - 1)
        return [res, sql.raw(", ")];
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning, withList, from, joins, comment, ignoreSelectionCastCodecs }) {
    const withSql = this.buildWithCTE(withList);
    const tableName = table[PgTable.Symbol.Name];
    const tableSchema = table[PgTable.Symbol.Schema];
    const origTableName = table[PgTable.Symbol.OriginalName];
    const alias = tableName === origTableName ? undefined : tableName;
    const tableSql = sql`${tableSchema ? sql`${sql.identifier(tableSchema)}.` : undefined}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}`;
    const setSql = this.buildUpdateSet(table, set);
    const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
    const joinsSql = this.buildJoins(joins);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
      isSingleTable: !from,
      ignoreCastCodecs: ignoreSelectionCastCodecs
    })}` : undefined;
    return sql`${withSql}update ${tableSql} set ${setSql}${fromSql}${joinsSql}${where ? sql` where ${where}` : undefined}${returningSql}${comment !== undefined ? sql` ${comment}` : undefined}`;
  }
  buildSelection(fields, { isSingleTable = false, ignoreCastCodecs = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field, codecOverride, column }, i) => {
      const chunk = [];
      const override = codecOverride;
      if (is(field, SQL.Aliased))
        if (field.isSelectionField) {
          const query = !isSingleTable && field.origin !== undefined ? sql`${sql.identifier(field.origin)}.${sql.identifier(field.fieldAlias)}` : sql.identifier(field.fieldAlias);
          if (column && !ignoreCastCodecs)
            chunk.push(this.codecs.apply(column, "cast", query, override));
          else
            chunk.push(query);
        } else {
          const query = field.sql;
          if (isSingleTable) {
            const newSql = new SQL(query.queryChunks.map((c) => {
              if (is(c, PgColumn))
                return sql.identifier(c.name);
              return c;
            }));
            if (query.shouldInlineParams)
              newSql.inlineParams();
            chunk.push(column && !ignoreCastCodecs ? this.codecs.apply(column, "cast", newSql, override) : newSql);
          } else
            chunk.push(column && !ignoreCastCodecs ? this.codecs.apply(column, "cast", query, override) : query);
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      else if (is(field, SQL)) {
        const query = field;
        if (isSingleTable) {
          const newSql = new SQL(query.queryChunks.map((c) => {
            if (is(c, PgColumn))
              return sql.identifier(c.name);
            return c;
          }));
          if (query.shouldInlineParams)
            newSql.inlineParams();
          chunk.push(column && !ignoreCastCodecs ? this.codecs.apply(column, "cast", newSql, override) : newSql);
        } else
          chunk.push(column && !ignoreCastCodecs ? this.codecs.apply(column, "cast", query, override) : query);
      } else if (is(field, Column)) {
        let name;
        if (isSingleTable)
          name = field.isAlias ? sql.identifier(getOriginalColumnFromAlias2(field).name) : sql.identifier(field.name);
        else
          name = field.isAlias ? getOriginalColumnFromAlias2(field) : field;
        const casted = ignoreCastCodecs ? name : this.codecs.apply(field, "cast", name, override);
        chunk.push(field.isAlias ? sql`${casted} as ${field}` : casted);
      } else if (is(field, Subquery))
        if (column && !ignoreCastCodecs && !field._.isWith) {
          const innerCasted = this.codecs.apply(column, "cast", sql`(${field._.sql})`, override);
          chunk.push(sql`${innerCasted} ${sql.identifier(field._.alias)}`);
        } else
          chunk.push(column ? this.codecs.apply(column, "cast", field) : field, override);
      if (i < columnsLen - 1)
        chunk.push(sql`, `);
      return chunk;
    });
    return sql.join(chunks);
  }
  buildJoins(joins) {
    if (!joins || joins.length === 0)
      return;
    const joinsArray = [];
    for (const [index, joinMeta] of joins.entries()) {
      if (index === 0)
        joinsArray.push(sql` `);
      const table = joinMeta.table;
      const lateralSql = joinMeta.lateral ? sql` lateral` : undefined;
      const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : undefined;
      if (is(table, PgTable)) {
        const tableName = table[PgTable.Symbol.Name];
        const tableSchema = table[PgTable.Symbol.Schema];
        const origTableName = table[PgTable.Symbol.OriginalName];
        const alias = tableName === origTableName ? undefined : joinMeta.alias;
        joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : undefined}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`);
      } else if (is(table, View)) {
        const viewName = table[ViewBaseConfig].name;
        const viewSchema = table[ViewBaseConfig].schema;
        const origViewName = table[ViewBaseConfig].originalName;
        const alias = viewName === origViewName ? undefined : joinMeta.alias;
        joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : undefined}${sql.identifier(origViewName)}${alias && sql` ${sql.identifier(alias)}`}${onSql}`);
      } else
        joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join${lateralSql} ${table}${onSql}`);
      if (index < joins.length - 1)
        joinsArray.push(sql` `);
    }
    return sql.join(joinsArray);
  }
  buildFromTable(table) {
    if (is(table, Table) && table[Table.Symbol.IsAlias]) {
      let fullName = sql`${sql.identifier(table[Table.Symbol.OriginalName])}`;
      if (table[Table.Symbol.Schema])
        fullName = sql`${sql.identifier(table[Table.Symbol.Schema])}.${fullName}`;
      return sql`${fullName} ${sql.identifier(table[Table.Symbol.Name])}`;
    }
    if (is(table, View) && table[ViewBaseConfig].isAlias) {
      let fullName = sql`${sql.identifier(table[ViewBaseConfig].originalName)}`;
      if (table[ViewBaseConfig].schema)
        fullName = sql`${sql.identifier(table[ViewBaseConfig].schema)}.${fullName}`;
      return sql`${fullName} ${sql.identifier(table[ViewBaseConfig].name)}`;
    }
    return table;
  }
  buildSelectQuery({ withList, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClause, distinct, setOperators, comment, ignoreSelectionCastCodecs }) {
    if (!fieldsFlat)
      throw new Error("Select query builder must be provided with `fieldsFlat` on `buildSelectQuery` invocation");
    const fieldsList = fieldsFlat;
    for (const f of fieldsList)
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, PgViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? undefined : getTableName(table)) && !((table) => joins?.some(({ alias }) => alias === (table[Table.Symbol.IsAlias] ? getTableName(table) : table[Table.Symbol.BaseName])))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(`Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`);
      }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    let distinctSql;
    if (distinct)
      distinctSql = distinct === true ? sql` distinct` : sql` distinct on (${sql.join(distinct.on, sql`, `)})`;
    const selection = this.buildSelection(fieldsList, {
      isSingleTable,
      ignoreCastCodecs: ignoreSelectionCastCodecs || setOperators.length > 0
    });
    const tableSql = this.buildFromTable(table);
    const joinsSql = this.buildJoins(joins);
    const whereSql = where ? sql` where ${where}` : undefined;
    const havingSql = having ? sql` having ${having}` : undefined;
    let orderBySql;
    if (orderBy && orderBy.length > 0)
      orderBySql = sql` order by ${sql.join(orderBy, sql`, `)}`;
    let groupBySql;
    if (groupBy && groupBy.length > 0)
      groupBySql = sql` group by ${sql.join(groupBy, sql`, `)}`;
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : undefined;
    const offsetSql = offset ? sql` offset ${offset}` : undefined;
    const lockingClauseSql = sql.empty();
    if (lockingClause) {
      const clauseSql = sql` for ${sql.raw(lockingClause.strength)}`;
      if (lockingClause.config.of)
        clauseSql.append(sql` of ${sql.join(Array.isArray(lockingClause.config.of) ? lockingClause.config.of.map((it) => sql.identifier(it[PgTable.Symbol.Name])) : [sql.identifier(lockingClause.config.of[PgTable.Symbol.Name])], sql`, `)}`);
      if (lockingClause.config.noWait)
        clauseSql.append(sql` nowait`);
      else if (lockingClause.config.skipLocked)
        clauseSql.append(sql` skip locked`);
      lockingClauseSql.append(clauseSql);
    }
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClauseSql}${comment !== undefined ? sql` ${comment}` : undefined}`;
    if (setOperators.length > 0)
      return this.buildSetOperations(finalQuery, fieldsList, ignoreSelectionCastCodecs, setOperators);
    return finalQuery;
  }
  buildSetOperations(leftSelect, leftSelection, ignoreSelectionCastCodecs, setOperators) {
    const outputSelection = leftSelection;
    for (let i = 0;i < setOperators.length; ++i) {
      const setOperator = setOperators[i];
      if (!setOperator)
        throw new Error("Cannot pass undefined values to any set operator");
      leftSelect = this.buildSetOperationQuery({
        leftSelect,
        setOperator
      });
      const rightSelection = orderSelectedFields2(setOperator.rightSelect.getSelectedFields());
      for (let j = 0;j < outputSelection.length; ++j) {
        const l = outputSelection[j];
        const lPath = l.path.join(".");
        const r = rightSelection.find((e) => e.path.join(".") === lPath);
        const lc = l.codecOverride ?? l.column?.codec;
        const rc = r.codecOverride ?? r.column?.codec;
        outputSelection[j].codecOverride = lc && rc ? unionsTypeTable[lc]?.[rc] : lc;
      }
    }
    for (let i = 0;i < outputSelection.length; ++i) {
      const out = outputSelection[i];
      out.codec = out.codecOverride ? this.codecs.get(out.column, "normalize", out.codecOverride) : out.codec;
    }
    return ignoreSelectionCastCodecs ? leftSelect : sql`select ${this.buildSelection(outputSelection.map((field) => {
      if (is(field.field, SQL.Aliased)) {
        const ref = field.field.clone();
        ref.isSelectionField = true;
        return {
          ...field,
          field: ref
        };
      }
      if (is(field.field, Column) && field.field.isAlias) {
        const ref = new SQL.Aliased(sql`${sql.identifier(field.field.name)}`, field.field.name);
        ref.isSelectionField = true;
        return {
          ...field,
          field: ref
        };
      }
      if (is(field.field, Subquery)) {
        const ref = new SQL.Aliased(sql`${field.field.getSQL()}`, field.field._.alias);
        ref.isSelectionField = true;
        return {
          ...field,
          field: ref
        };
      }
      return field;
    }), {
      isSingleTable: true,
      ignoreCastCodecs: ignoreSelectionCastCodecs
    })} from (${leftSelect}) ${sql.identifier("drizzle_union")}`;
  }
  buildSetOperationQuery({ leftSelect, setOperator: { type, isAll, rightSelect, limit, orderBy, offset } }) {
    const leftChunk = sql`(${leftSelect.getSQL()}) `;
    const rightChunk = sql`(${rightSelect.withoutSelectionCastCodecs().getSQL()})`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy)
        if (is(singleOrderBy, PgColumn))
          orderByValues.push(sql.identifier(singleOrderBy.name));
        else if (is(singleOrderBy, SQL)) {
          for (let i = 0;i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, PgColumn))
              singleOrderBy.queryChunks[i] = sql.identifier(chunk.name);
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else
          orderByValues.push(sql`${singleOrderBy}`);
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)} `;
    }
    const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : undefined;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : undefined;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values: valuesOrSelect, onConflict, returning, withList, select, overridingSystemValue_, comment, ignoreSelectionCastCodecs }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns);
    const colFilteredEntries = select && !is(valuesOrSelect, SQL) ? Object.keys(valuesOrSelect.getSelectedFields()).map((key) => [key, columns[key]]) : overridingSystemValue_ ? colEntries : colEntries.filter(([_, col]) => !col.shouldDisableInsert());
    const insertOrder = colFilteredEntries.map(([, column]) => sql.identifier(column.name));
    if (select) {
      const select = valuesOrSelect;
      if (is(select, SQL))
        valuesSqlList.push(select);
      else
        valuesSqlList.push(select.getSQL());
    } else {
      const values = valuesOrSelect;
      valuesSqlList.push(sql.raw("values "));
      for (const [valueIndex, value] of values.entries()) {
        const valueList = [];
        for (const [fieldName, col] of colFilteredEntries) {
          const colValue = value[fieldName];
          if (colValue === undefined || is(colValue, Param) && colValue.value === undefined)
            if (col.defaultFn !== undefined) {
              const defaultFnResult = col.defaultFn();
              const defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
              valueList.push(defaultValue);
            } else if (!col.default && col.onUpdateFn !== undefined) {
              const onUpdateFnResult = col.onUpdateFn();
              const newValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
              valueList.push(newValue);
            } else
              valueList.push(sql`default`);
          else
            valueList.push(colValue);
        }
        valuesSqlList.push(valueList);
        if (valueIndex < values.length - 1)
          valuesSqlList.push(sql`, `);
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, {
      isSingleTable: true,
      ignoreCastCodecs: ignoreSelectionCastCodecs
    })}` : undefined;
    const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : undefined;
    return sql`${withSql}insert into ${table} ${insertOrder} ${overridingSystemValue_ === true ? sql`overriding system value ` : undefined}${valuesSql}${onConflictSql}${returningSql}${comment !== undefined ? sql` ${comment}` : undefined}`;
  }
  buildRefreshMaterializedViewQuery({ view, concurrently, withNoData }) {
    return sql`refresh materialized view${concurrently ? sql` concurrently` : undefined} ${view}${withNoData ? sql` with no data` : undefined}`;
  }
  sqlToQuery(sql2, invokeSource) {
    return sql2.toQuery({
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      codecs: this.codecs,
      invokeSource
    });
  }
  _sqlToQuery(sql2) {
    return sql2.toQuery({
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString,
      codecs: this.codecs,
      tagged: true
    });
  }
  buildRqbColumn(table, field, key, inJson) {
    if (is(field, Column)) {
      const name = sql`${table}.${sql.identifier(field.name)}`;
      return sql`${inJson && field.jsonSelectIdentifier ? field.jsonSelectIdentifier(name, sql, field.dimensions) : this.codecs.apply(field, inJson ? "castInJson" : "cast", name)} as ${sql.identifier(key)}`;
    }
    if (is(field, SQL.Aliased)) {
      const column = getColumnFromDecoder2(field);
      const q = sql`${table}.${sql.identifier(field.fieldAlias)}`;
      return sql`${column ? this.codecs.apply(column, inJson ? "castInJson" : "cast", q) : q} as ${sql.identifier(key)}`;
    }
    if (isSQLWrapper(field)) {
      const column = getColumnFromDecoder2(field);
      const q = sql`${table}.${sql.identifier(key)}`;
      return sql`${column ? this.codecs.apply(column, inJson ? "castInJson" : "cast", q) : q} as ${sql.identifier(key)}`;
    }
    throw new DrizzleError2({ message: `Views with nested selections are not supported by the relational query builder` });
  }
  resolveSelection(field, key, inJson) {
    if (is(field, Column))
      return {
        key,
        field,
        codec: this.codecs.get(field, inJson ? "normalizeInJson" : "normalize"),
        arrayDimensions: field.dimensions
      };
    const decoderColumn = getColumnFromDecoder2(field);
    return decoderColumn ? {
      key,
      field,
      codec: decoderColumn && (!inJson || !decoderColumn.mapFromJsonValue) ? this.codecs.get(decoderColumn, inJson ? "normalizeInJson" : "normalize") : undefined,
      arrayDimensions: decoderColumn.dimensions
    } : {
      key,
      field
    };
  }
  buildColumns = (table, selection, inJson, config) => {
    if (!config?.columns)
      return sql.join(Object.entries(table[TableColumns]).map(([k, v]) => {
        selection.push(this.resolveSelection(v, k, inJson));
        return this.buildRqbColumn(table, v, k, inJson);
      }), sql`, `);
    const entries = Object.entries(config.columns);
    const columnContainer = table[TableColumns];
    const columnIdentifiers = [];
    let colSelectionMode;
    for (const [k, v] of entries) {
      if (v === undefined)
        continue;
      colSelectionMode = colSelectionMode || v;
      if (v) {
        const column = columnContainer[k];
        columnIdentifiers.push(this.buildRqbColumn(table, column, k, inJson));
        selection.push(this.resolveSelection(column, k, inJson));
      }
    }
    if (colSelectionMode === false)
      for (const [k, v] of Object.entries(columnContainer)) {
        if (config.columns[k] === false)
          continue;
        columnIdentifiers.push(this.buildRqbColumn(table, v, k, inJson));
        selection.push(this.resolveSelection(v, k, inJson));
      }
    return columnIdentifiers.length ? sql.join(columnIdentifiers, sql`, `) : undefined;
  };
  buildRelationalQuery({ schema, table, tableConfig, queryConfig: config, relationWhere, mode, errorPath, depth, throughJoin, nested }) {
    const selection = [];
    const isSingle = mode === "first";
    const params = config === true ? undefined : config;
    const currentPath = errorPath ?? "";
    const currentDepth = depth ?? 0;
    if (!currentDepth)
      table = aliasedTable2(table, `d${currentDepth}`);
    const limit = isSingle ? 1 : params?.limit;
    const offset = params?.offset;
    const where = params?.where && relationWhere ? and(relationsFilterToSQL2(table, params.where, tableConfig.relations, schema), relationWhere) : params?.where ? relationsFilterToSQL2(table, params.where, tableConfig.relations, schema) : relationWhere;
    const order = params?.orderBy ? relationsOrderToSQL2(table, params.orderBy) : undefined;
    const columns = this.buildColumns(table, selection, !!nested, params);
    const extras = params?.extras ? relationExtrasToSQL2(table, params.extras, this.codecs, nested) : undefined;
    if (extras)
      selection.push(...extras.selection);
    const selectionArr = columns ? [columns] : [];
    if (extras?.sql)
      selectionArr.push(extras.sql);
    const joins = params ? (() => {
      const { with: joins } = params;
      if (!joins)
        return;
      const withEntries = Object.entries(joins).filter(([_, v]) => v);
      if (!withEntries.length)
        return;
      return sql.join(withEntries.map(([k, join]) => {
        const relation = tableConfig.relations[k];
        const isSingle = is(relation, One2);
        const targetTable = aliasedTable2(relation.targetTable, `d${currentDepth + 1}`);
        const throughTable = relation.throughTable ? aliasedTable2(relation.throughTable, `tr${currentDepth}`) : undefined;
        const { filter, joinCondition } = relationToSQL2(relation, table, targetTable, throughTable);
        selectionArr.push(sql`${sql.identifier(k)}.${sql.identifier("r")} as ${sql.identifier(k)}`);
        const throughJoin = throughTable ? sql` inner join ${getTableAsAliasSQL2(throughTable)} on ${joinCondition}` : undefined;
        const innerQuery = this.buildRelationalQuery({
          table: targetTable,
          mode: isSingle ? "first" : "many",
          schema,
          queryConfig: join,
          tableConfig: schema[relation.targetTableName],
          relationWhere: filter,
          errorPath: `${currentPath.length ? `${currentPath}.` : ""}${k}`,
          depth: currentDepth + 1,
          throughJoin,
          nested: true
        });
        selection.push({
          field: targetTable,
          key: k,
          selection: innerQuery.selection,
          isArray: !isSingle,
          isOptional: (relation.optional ?? false) || join !== true && !!join.where
        });
        return sql`left join lateral(select ${isSingle ? sql`row_to_json(${sql.identifier("t")}.*) ${sql.identifier("r")}` : sql`coalesce(json_agg(row_to_json(${sql.identifier("t")}.*)), '[]') as ${sql.identifier("r")}`} from (${innerQuery.sql}) as ${sql.identifier("t")}) as ${sql.identifier(k)} on true`;
      }), sql` `);
    })() : undefined;
    if (!selectionArr.length)
      throw new DrizzleError2({ message: `No fields selected for table "${tableConfig.name}"${currentPath ? ` ("${currentPath}")` : ""}` });
    const selectionSet = sql.join(selectionArr.filter((e) => e !== undefined), sql`, `);
    const comment = config !== true && config?.comment ? sql.comment(config.comment) : undefined;
    return {
      sql: sql`select ${selectionSet} from ${getTableAsAliasSQL2(table)}${throughJoin}${joins ? sql` ${joins}` : undefined}${where ? sql` where ${where}` : undefined}${order ? sql` order by ${order}` : undefined}${limit !== undefined ? sql` limit ${limit}` : undefined}${offset !== undefined ? sql` offset ${offset}` : undefined}${comment ? sql` ${comment}` : undefined}`,
      selection
    };
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/query-builder.js
var QueryBuilder = class {
  static [entityKind] = "PgQueryBuilder";
  dialect;
  dialectConfig;
  constructor(dialect) {
    this.dialect = is(dialect, PgDialect) ? dialect : undefined;
    this.dialectConfig = is(dialect, PgDialect) ? undefined : dialect;
  }
  $with = (alias, selection) => {
    const queryBuilder = this;
    const as = (qb) => {
      if (typeof qb === "function")
        qb = qb(queryBuilder);
      const sql = ("withoutSelectionCastCodecs" in qb ? qb.withoutSelectionCastCodecs() : qb).getSQL();
      return new Proxy(new WithSubquery(sql, selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}), alias, true, sql.usedTables ?? []), new SelectionProxyHandler({
        alias,
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      }));
    };
    return { as };
  };
  with(...queries) {
    const self = this;
    function select(fields) {
      return new PgSelectBuilder({
        fields: fields ?? undefined,
        session: undefined,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? undefined,
        session: undefined,
        dialect: self.getDialect(),
        distinct: true
      });
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? undefined,
        session: undefined,
        dialect: self.getDialect(),
        distinct: { on }
      });
    }
    return {
      select,
      selectDistinct,
      selectDistinctOn
    };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? undefined,
      session: undefined,
      dialect: this.getDialect()
    });
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? undefined,
      session: undefined,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? undefined,
      session: undefined,
      dialect: this.getDialect(),
      distinct: { on }
    });
  }
  getDialect() {
    if (!this.dialect)
      this.dialect = new PgDialect(this.dialectConfig);
    return this.dialect;
  }
};

// node_modules/drizzle-orm/pg-core/query-builders/insert.js
var PgInsertBuilder = class {
  static [entityKind] = "PgInsertBuilder";
  constructor(table, session, dialect, withList, overridingSystemValue_, builder = PgInsertBase) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
    this.overridingSystemValue_ = overridingSystemValue_;
    this.builder = builder;
  }
  overridingSystemValue() {
    this.overridingSystemValue_ = true;
    return this;
  }
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0)
      throw new Error("values() must be called with at least one value");
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new this.builder(this.table, mappedValues, this.session, this.dialect, this.withList, false, this.overridingSystemValue_);
  }
  select(selectQuery) {
    const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder) : selectQuery;
    if ("withoutSelectionCastCodecs" in select)
      select.withoutSelectionCastCodecs();
    if (!is(select, SQL)) {
      const insertCols = Object.keys(this.table[Table.Symbol.Columns]);
      const selected = Object.keys(select._.selectedFields);
      for (const col of selected)
        if (!insertCols.includes(col))
          throw new Error(`Insert select error: column "${col}" does not exist in table "${this.table[Table.Symbol.Name]}"`);
    }
    return new this.builder(this.table, select, this.session, this.dialect, this.withList, true, this.overridingSystemValue_);
  }
};
var PgInsertBase = class {
  static [entityKind] = "PgInsert";
  config;
  constructor(table, values, session, dialect, withList, select, overridingSystemValue_) {
    this.session = session;
    this.dialect = dialect;
    this.config = {
      table,
      values,
      withList,
      select,
      overridingSystemValue_
    };
  }
  returning(fields = this.config.table[Table.Symbol.Columns]) {
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields2(this.config.returningFields, undefined, this.dialect.codecs);
    return this;
  }
  onConflictDoNothing(config = {}) {
    if (config.target === undefined)
      this.config.onConflict = sql`do nothing`;
    else {
      let targetColumn = "";
      targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(it.name)).join(",") : this.dialect.escapeName(config.target.name);
      const whereSql = config.where ? sql` where ${config.where}` : undefined;
      this.config.onConflict = sql`(${sql.raw(targetColumn)})${whereSql} do nothing`;
    }
    return this;
  }
  onConflictDoUpdate(config) {
    if (config.where && (config.targetWhere || config.setWhere))
      throw new Error('You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.');
    const whereSql = config.where ? sql` where ${config.where}` : undefined;
    const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : undefined;
    const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : undefined;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet2(this.config.table, config.set));
    let targetColumn = "";
    targetColumn = Array.isArray(config.target) ? config.target.map((it) => this.dialect.escapeName(it.name)).join(",") : this.dialect.escapeName(config.target.name);
    this.config.onConflict = sql`(${sql.raw(targetColumn)})${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
    return this;
  }
  comment(comment) {
    this.config.comment = sql.comment(comment);
    return this;
  }
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    return this.dialect.sqlToQuery(this.getSQL());
  }
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(this.config.returningFields, new SelectionProxyHandler({
      alias: getTableName(this.config.table),
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    })) : undefined;
  }
  withoutSelectionCastCodecs() {
    this.config.ignoreSelectionCastCodecs = true;
    return this;
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/pg-core/async/insert.js
var PgAsyncInsertBase = class extends PgInsertBase {
  static [entityKind] = "PgAsyncInsert";
  _prepare(name, generateName = false) {
    const { session, config, dialect } = this;
    const { returning: fields } = config;
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const query = dialect.sqlToQuery(this.getSQL());
      const mapper = fields ? this.dialect.mapperGenerators.rows(fields, undefined) : undefined;
      return session.prepareQuery(query, fields ? "arrays" : "raw", name ?? generateName, mapper, {
        type: "insert",
        tables: [...extractUsedTable(this.config.table)]
      });
    });
  }
  prepare(name) {
    return this._prepare(name, true);
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  };
};
applyMixins2(PgAsyncInsertBase, [QueryPromise2]);

// node_modules/drizzle-orm/pg-core/async/query.js
var PgAsyncRelationalQuery = class extends PgRelationalQuery {
  static [entityKind] = "PgAsyncRelationalQueryV2";
  _prepare(name, generateName = false) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const { query, builtQuery } = this._toSQL();
      const mapper = this.dialect.mapperGenerators.relationalRows({
        isFirst: this.mode === "first",
        parseJson: this.parseJson,
        parseJsonIfString: false,
        rootJsonMappers: false,
        selection: query.selection,
        arrayModeRoot: true
      });
      return this.session.prepareQuery(builtQuery, "arrays", name ?? generateName, mapper);
    });
  }
  prepare(name) {
    return this._prepare(name, true);
  }
  execute(placeholderValues) {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  }
};
applyMixins2(PgAsyncRelationalQuery, [QueryPromise2]);

// node_modules/drizzle-orm/pg-core/query-builders/raw.js
var PgRaw = class {
  static [entityKind] = "PgRaw";
  constructor(prepared, sql, query) {
    this.prepared = prepared;
    this.sql = sql;
    this.query = query;
  }
  getSQL() {
    return this.sql;
  }
  getQuery() {
    return this.query;
  }
  _prepare() {
    return this.prepared;
  }
};

// node_modules/drizzle-orm/pg-core/async/raw.js
var PgAsyncRaw = class extends PgRaw {
  static [entityKind] = "PgAsyncRaw";
  constructor(prepared, sql, query) {
    super(prepared, sql, query);
  }
  execute(placeholderValues) {
    return this.prepared.execute(placeholderValues);
  }
  _prepare() {
    return this.prepared;
  }
};
applyMixins2(PgAsyncRaw, [QueryPromise2]);

// node_modules/drizzle-orm/pg-core/query-builders/refresh-materialized-view.js
var PgRefreshMaterializedView = class {
  static [entityKind] = "PgRefreshMaterializedView";
  config;
  constructor(view, session, dialect) {
    this.session = session;
    this.dialect = dialect;
    this.config = { view };
  }
  concurrently() {
    if (this.config.withNoData !== undefined)
      throw new Error("Cannot use concurrently and withNoData together");
    this.config.concurrently = true;
    return this;
  }
  withNoData() {
    if (this.config.concurrently !== undefined)
      throw new Error("Cannot use concurrently and withNoData together");
    this.config.withNoData = true;
    return this;
  }
  getSQL() {
    return this.dialect.buildRefreshMaterializedViewQuery(this.config);
  }
  toSQL() {
    return this.dialect.sqlToQuery(this.getSQL());
  }
};

// node_modules/drizzle-orm/pg-core/async/refresh-materialized-view.js
var PgAsyncRefreshMaterializedView = class extends PgRefreshMaterializedView {
  static [entityKind] = "PgAsyncRefreshMaterializedView";
  _prepare(name, generateName = false) {
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const query = this.dialect.sqlToQuery(this.getSQL());
      return this.session.prepareQuery(query, "raw", name ?? generateName);
    });
  }
  prepare(name) {
    return this._prepare(name, true);
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  };
};
applyMixins2(PgAsyncRefreshMaterializedView, [QueryPromise2]);

// node_modules/drizzle-orm/pg-core/async/select.js
var PgAsyncSelectBase = class extends PgSelectBase {
  static [entityKind] = "PgAsyncSelectQueryBuilder";
  _prepare(name, generateName = false) {
    const { session, dialect, cacheConfig, usedTables } = this;
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const query = this.config.tagged ? dialect._sqlToQuery(this.getSQL()) : dialect.sqlToQuery(this.getSQL());
      const fieldsList = this.config.fieldsFlat;
      const mapper = this.dialect.mapperGenerators.rows(fieldsList, this.joinsNotNullableMap);
      return session.prepareQuery(query, "arrays", name ?? generateName, mapper, {
        type: "select",
        tables: [...usedTables]
      }, cacheConfig);
    });
  }
  prepare(name) {
    return this._prepare(name, true);
  }
  execute(placeholderValues) {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  }
};
applyMixins2(PgAsyncSelectBase, [QueryPromise2]);

// node_modules/drizzle-orm/pg-core/query-builders/update.js
var PgUpdateBuilder = class {
  static [entityKind] = "PgUpdateBuilder";
  constructor(table, session, dialect, withList, builder = PgUpdateBase) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
    this.builder = builder;
  }
  set(values) {
    return new this.builder(this.table, mapUpdateSet2(this.table, values), this.session, this.dialect, this.withList);
  }
};
var PgUpdateBase = class {
  static [entityKind] = "PgUpdate";
  config;
  tableName;
  joinsNotNullableMap;
  constructor(table, set, session, dialect, withList) {
    this.session = session;
    this.dialect = dialect;
    this.config = {
      set,
      table,
      withList,
      joins: []
    };
    this.tableName = getTableLikeName2(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  from(source) {
    const src = source;
    const tableName = getTableLikeName2(src);
    if (typeof tableName === "string")
      this.joinsNotNullableMap[tableName] = true;
    this.config.from = src;
    return this;
  }
  getTableLikeFields(table) {
    if (is(table, PgTable))
      return table[Table.Symbol.Columns];
    else if (is(table, Subquery))
      return table._.selectedFields;
    return table[ViewBaseConfig].selectedFields;
  }
  createJoin(joinType) {
    return (table, on) => {
      const tableName = getTableLikeName2(table);
      if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName))
        throw new Error(`Alias "${tableName}" is already used in this query`);
      if (typeof on === "function") {
        const from = this.config.from && !is(this.config.from, SQL) ? this.getTableLikeFields(this.config.from) : undefined;
        on = on(new Proxy(this.config.table[Table.Symbol.Columns], new SelectionProxyHandler({
          sqlAliasedBehavior: "sql",
          sqlBehavior: "sql"
        })), from && new Proxy(from, new SelectionProxyHandler({
          sqlAliasedBehavior: "sql",
          sqlBehavior: "sql"
        })));
      }
      this.config.joins.push({
        on,
        table,
        joinType,
        alias: tableName
      });
      if (typeof tableName === "string")
        switch (joinType) {
          case "left":
            this.joinsNotNullableMap[tableName] = false;
            break;
          case "right":
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = true;
            break;
          case "inner":
            this.joinsNotNullableMap[tableName] = true;
            break;
          case "full":
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = false;
            break;
        }
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields) {
    if (!fields) {
      fields = Object.assign({}, this.config.table[Table.Symbol.Columns]);
      if (this.config.from) {
        const tableName = getTableLikeName2(this.config.from);
        if (typeof tableName === "string" && this.config.from && !is(this.config.from, SQL)) {
          const fromFields = this.getTableLikeFields(this.config.from);
          fields[tableName] = fromFields;
        }
        for (const join of this.config.joins) {
          const tableName = getTableLikeName2(join.table);
          if (typeof tableName === "string" && !is(join.table, SQL)) {
            const fromFields = this.getTableLikeFields(join.table);
            fields[tableName] = fromFields;
          }
        }
      }
    }
    this.config.returningFields = fields;
    this.config.returning = orderSelectedFields2(fields, undefined, this.dialect.codecs);
    return this;
  }
  comment(comment) {
    this.config.comment = sql.comment(comment);
    return this;
  }
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    return this.dialect.sqlToQuery(this.getSQL());
  }
  getSelectedFields() {
    return this.config.returningFields ? new Proxy(this.config.returningFields, new SelectionProxyHandler({
      alias: getTableName(this.config.table),
      sqlAliasedBehavior: "alias",
      sqlBehavior: "error"
    })) : undefined;
  }
  withoutSelectionCastCodecs() {
    this.config.ignoreSelectionCastCodecs = true;
    return this;
  }
  $dynamic() {
    return this;
  }
};

// node_modules/drizzle-orm/pg-core/async/update.js
var PgAsyncUpdateBase = class extends PgUpdateBase {
  static [entityKind] = "PgAsyncUpdate";
  _prepare(name, generateName = false) {
    const { session, config, dialect, joinsNotNullableMap } = this;
    const { returning: fields } = config;
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const query = dialect.sqlToQuery(this.getSQL());
      const mapper = fields ? this.dialect.mapperGenerators.rows(fields, joinsNotNullableMap) : undefined;
      return session.prepareQuery(query, fields ? "arrays" : "raw", name ?? generateName, mapper, {
        type: "update",
        tables: [...extractUsedTable(this.config.table)]
      });
    });
  }
  prepare(name) {
    return this._prepare(name, true);
  }
  execute = (placeholderValues = {}) => {
    return this._prepare().execute(placeholderValues);
  };
};
applyMixins2(PgAsyncUpdateBase, [QueryPromise2]);
// node_modules/drizzle-orm/pg-core/async/db.js
var PgAsyncDatabase = class {
  static [entityKind] = "PgAsyncDatabase";
  query;
  constructor(dialect, session, relations, parseRqbJson = false, tagged = false) {
    this.dialect = dialect;
    this.session = session;
    this.tagged = tagged;
    this._ = {
      relations,
      session
    };
    this.query = {};
    for (const [tableName, relation] of Object.entries(relations))
      this.query[tableName] = new RelationalQueryBuilder(relations, relations[relation.name].table, relation, dialect, session, parseRqbJson, PgAsyncRelationalQuery);
    this.$cache = { invalidate: async (_params) => {} };
  }
  $with = (alias, selection) => {
    const as = (qb) => {
      if (typeof qb === "function")
        qb = qb(new QueryBuilder(this.dialect));
      const sql2 = ("withoutSelectionCastCodecs" in qb ? qb.withoutSelectionCastCodecs() : qb).getSQL();
      return new Proxy(new WithSubquery(sql2, selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}), alias, true, sql2.usedTables ?? []), new SelectionProxyHandler({
        alias,
        sqlAliasedBehavior: "alias",
        sqlBehavior: "error"
      }));
    };
    return { as };
  };
  $count(source, filters) {
    return new PgAsyncCountBuilder({
      source,
      filters,
      session: this.session,
      dialect: this.dialect
    });
  }
  $cache;
  with(...queries) {
    const self = this;
    function select(fields) {
      return new PgSelectBuilder({
        fields: fields ?? undefined,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        tagged: self.tagged
      }, PgAsyncSelectBase);
    }
    function selectDistinct(fields) {
      return new PgSelectBuilder({
        fields: fields ?? undefined,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true,
        tagged: self.tagged
      }, PgAsyncSelectBase);
    }
    function selectDistinctOn(on, fields) {
      return new PgSelectBuilder({
        fields: fields ?? undefined,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: { on },
        tagged: self.tagged
      }, PgAsyncSelectBase);
    }
    function update(table) {
      return new PgUpdateBuilder(table, self.session, self.dialect, queries, PgAsyncUpdateBase);
    }
    function insert(table) {
      return new PgInsertBuilder(table, self.session, self.dialect, queries, undefined, PgAsyncInsertBase);
    }
    function delete_(table) {
      return new PgAsyncDeleteBase(table, self.session, self.dialect, queries);
    }
    return {
      select,
      selectDistinct,
      selectDistinctOn,
      update,
      insert,
      delete: delete_
    };
  }
  select(fields) {
    return new PgSelectBuilder({
      fields: fields ?? undefined,
      session: this.session,
      dialect: this.dialect,
      tagged: this.tagged
    }, PgAsyncSelectBase);
  }
  selectDistinct(fields) {
    return new PgSelectBuilder({
      fields: fields ?? undefined,
      session: this.session,
      dialect: this.dialect,
      distinct: true,
      tagged: this.tagged
    }, PgAsyncSelectBase);
  }
  selectDistinctOn(on, fields) {
    return new PgSelectBuilder({
      fields: fields ?? undefined,
      session: this.session,
      dialect: this.dialect,
      distinct: { on },
      tagged: this.tagged
    }, PgAsyncSelectBase);
  }
  update(table) {
    return new PgUpdateBuilder(table, this.session, this.dialect, undefined, PgAsyncUpdateBase);
  }
  insert(table) {
    return new PgInsertBuilder(table, this.session, this.dialect, undefined, undefined, PgAsyncInsertBase);
  }
  delete(table) {
    return new PgAsyncDeleteBase(table, this.session, this.dialect);
  }
  refreshMaterializedView(view) {
    return new PgAsyncRefreshMaterializedView(view, this.session, this.dialect);
  }
  execute(query) {
    const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
    const builtQuery = this.dialect.sqlToQuery(sequel);
    return new PgAsyncRaw(this.session.prepareQuery(builtQuery, "raw", false), sequel, builtQuery);
  }
  transaction(transaction, config) {
    return this.session.transaction(transaction, config);
  }
};

// node_modules/drizzle-orm/pg-core/session.js
var PgBasePreparedQuery = class {
  static [entityKind] = "PgBasePreparedQuery";
  constructor(query) {
    this.query = query;
  }
  getQuery() {
    return this.query;
  }
};
var PgSession = class {
  static [entityKind] = "PgSession";
  constructor(dialect) {
    this.dialect = dialect;
  }
};

// node_modules/drizzle-orm/pg-core/async/session.js
var PgAsyncPreparedQuery = class extends PgBasePreparedQuery {
  static [entityKind] = "PgAsyncPreparedQuery";
  mapper;
  fastPath;
  constructor(executor, query, mapper, mode, logger, cache, queryMetadata, cacheConfig) {
    super(query);
    this.executor = executor;
    this.mode = mode;
    this.logger = logger;
    this.cache = cache;
    this.queryMetadata = queryMetadata;
    this.cacheConfig = cacheConfig;
    this.mapper = mapper;
    if (cache && cache.strategy() === "all" && cacheConfig === undefined)
      this.cacheConfig = {
        enabled: true,
        autoInvalidate: true
      };
    if (!this.cacheConfig?.enabled)
      this.cacheConfig = undefined;
    this.fastPath = cacheConfig === undefined && (cache === undefined || is(cache, NoopCache)) && !hasTelemetry;
  }
  async execute(placeholderValues = {}) {
    const { query, logger, executor, mapper, fastPath } = this;
    if (fastPath) {
      const sql2 = query._sql ? query._sql.join(" ") : query.sql;
      const params = query.params.length === 0 ? query.params : fillPlaceholders(query.params, placeholderValues);
      logger.logQuery(sql2, params);
      const res = executor(params).catch((e) => {
        throw new DrizzleQueryError2(sql2, params, e);
      });
      if (!mapper)
        return res;
      return res.then((rows) => mapper(rows));
    }
    return tracer.startActiveSpan("drizzle.execute", async (span) => {
      const params = fillPlaceholders(this.query.params, placeholderValues);
      const sql2 = this.query._sql ? this.query._sql.join(" ") : this.query.sql;
      const { mapper } = this;
      span?.setAttributes({
        "drizzle.query.text": sql2,
        "drizzle.query.params": JSON.stringify(params)
      });
      this.logger.logQuery(sql2, params);
      const query = tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
        span?.setAttributes({
          "drizzle.query.text": sql2,
          "drizzle.query.params": JSON.stringify(params)
        });
        return await this.queryWithCache(sql2, params, () => this.executor(params));
      });
      if (!mapper)
        return query;
      return query.then((rows) => tracer.startActiveSpan("drizzle.mapResponse", () => mapper(rows)));
    });
  }
  async queryWithCache(queryString, params, query) {
    const cacheStrat = this.cache !== undefined && !is(this.cache, NoopCache) ? await strategyFor(queryString, params, this.queryMetadata, this.cacheConfig) : { type: "skip" };
    if (cacheStrat.type === "skip")
      return query().catch((e) => {
        throw new DrizzleQueryError2(queryString, params, e);
      });
    const cache = this.cache;
    if (cacheStrat.type === "invalidate")
      return Promise.all([query(), cache.onMutate({ tables: cacheStrat.tables })]).then((res) => res[0]).catch((e) => {
        throw new DrizzleQueryError2(queryString, params, e);
      });
    if (cacheStrat.type === "try") {
      const { tables, key, isTag, autoInvalidate, config } = cacheStrat;
      const fromCache = await cache.get(key, tables, isTag, autoInvalidate);
      if (fromCache === undefined) {
        const result = await query().catch((e) => {
          throw new DrizzleQueryError2(queryString, params, e);
        });
        await cache.put(key, result, autoInvalidate ? tables : [], isTag, config);
        return result;
      }
      return fromCache;
    }
    assertUnreachable2(cacheStrat);
  }
};
var PgAsyncSession = class extends PgSession {
  static [entityKind] = "PgAsyncSession";
  execute(query) {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.prepareQuery(this.dialect.sqlToQuery(query), "raw", false);
      }).execute();
    });
  }
  arrays(query) {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.prepareQuery(this.dialect.sqlToQuery(query), "arrays", false);
      }).execute();
    });
  }
  objects(query) {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return tracer.startActiveSpan("drizzle.prepareQuery", () => {
        return this.prepareQuery(this.dialect.sqlToQuery(query), "objects", false);
      }).execute();
    });
  }
};
var PgAsyncTransaction = class extends PgAsyncDatabase {
  static [entityKind] = "PgAsyncTransaction";
  constructor(dialect, session, relations, nestedIndex = 0, parseRqbJson) {
    super(dialect, session, relations, parseRqbJson);
    this.nestedIndex = nestedIndex;
  }
  rollback() {
    throw new TransactionRollbackError2;
  }
  getTransactionConfigSQL(config) {
    const chunks = [];
    if (config.isolationLevel)
      chunks.push(`isolation level ${config.isolationLevel}`);
    if (config.accessMode)
      chunks.push(config.accessMode);
    if (typeof config.deferrable === "boolean")
      chunks.push(config.deferrable ? "deferrable" : "not deferrable");
    return sql.raw(chunks.join(" "));
  }
  setTransaction(config) {
    return this.session.execute(sql`set transaction ${this.getTransactionConfigSQL(config)}`);
  }
};

// node_modules/pg/esm/index.mjs
var import_lib = __toESM(require_lib2(), 1);
var Client = import_lib.default.Client;
var Pool = import_lib.default.Pool;
var Connection = import_lib.default.Connection;
var types = import_lib.default.types;
var Query = import_lib.default.Query;
var DatabaseError = import_lib.default.DatabaseError;
var escapeIdentifier = import_lib.default.escapeIdentifier;
var escapeLiteral = import_lib.default.escapeLiteral;
var Result = import_lib.default.Result;
var TypeOverrides = import_lib.default.TypeOverrides;
var defaults = import_lib.default.defaults;
var esm_default = import_lib.default;

// node_modules/drizzle-orm/node-postgres/session.js
var { Pool: Pool$1, types: types2 } = esm_default;
var noop2 = (val) => val;
var typeConfig = { getTypeParser: (typeId, format) => {
  switch (typeId) {
    case types2.builtins.TIMESTAMPTZ:
    case types2.builtins.TIMESTAMP:
    case types2.builtins.DATE:
    case types2.builtins.INTERVAL:
    case 1231:
    case 1115:
    case 1185:
    case 1187:
    case 1182:
      return noop2;
    default:
      return types2.getTypeParser(typeId, format);
  }
} };
var NodePgSession = class NodePgSession extends PgAsyncSession {
  static [entityKind] = "NodePgSession";
  logger;
  cache;
  constructor(client, dialect, relations, options = {}) {
    super(dialect);
    this.client = client;
    this.relations = relations;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger2;
    this.cache = options.cache ?? new NoopCache;
  }
  prepareQuery(query, mode, name, mapper, queryMetadata, cacheConfig) {
    const queryName = typeof name === "string" ? name : name === true ? preparedStatementName(query.sql, query.params) : undefined;
    const executor = async (params) => {
      return this.client.query({
        name: queryName,
        rowMode: mode === "arrays" ? "array" : undefined,
        text: query.sql,
        types: typeConfig
      }, params).then((r) => mode === "raw" ? r : r.rows);
    };
    return new PgAsyncPreparedQuery(executor, query, mapper, mode, this.logger, this.cache, queryMetadata, cacheConfig);
  }
  async transaction(transaction, config) {
    const isPool = this.client instanceof Pool$1 || Object.getPrototypeOf(this.client).constructor.name.includes("Pool");
    const session = isPool ? new NodePgSession(await this.client.connect(), this.dialect, this.relations, this.options) : this;
    const tx = new NodePgTransaction(this.dialect, session, this.relations, undefined, false);
    await tx.execute(sql`begin${config ? sql` ${tx.getTransactionConfigSQL(config)}` : undefined}`);
    try {
      const result = await transaction(tx);
      await tx.execute(sql`commit`);
      return result;
    } catch (error) {
      await tx.execute(sql`rollback`);
      throw error;
    } finally {
      if (isPool)
        session.client.release();
    }
  }
};
var NodePgTransaction = class NodePgTransaction extends PgAsyncTransaction {
  static [entityKind] = "NodePgTransaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new NodePgTransaction(this.dialect, this.session, this._.relations, this.nestedIndex + 1, false);
    await tx.execute(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await tx.execute(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
};

// node_modules/drizzle-orm/node-postgres/driver.js
var NodePgDatabase = class extends PgAsyncDatabase {
  static [entityKind] = "NodePgDatabase";
};
function construct(client, config = {}) {
  const dialect = new PgDialect({
    useJitMappers: jitCompatCheck2(config.jit),
    codecs: config.codecs ?? nodePgCodecs
  });
  let logger;
  if (config.logger === true)
    logger = new DefaultLogger2;
  else if (config.logger !== false)
    logger = config.logger;
  const relations = config.relations ?? {};
  const db = new NodePgDatabase(dialect, new NodePgSession(client, dialect, relations, {
    logger,
    cache: config.cache
  }), relations);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache)
    db.$cache["invalidate"] = config.cache?.onMutate;
  return db;
}
function drizzle(...params) {
  if (typeof params[0] === "string")
    return construct(new esm_default.Pool({ connectionString: params[0] }), params[1]);
  const { connection, client, ...drizzlePgCDrizzlePgConfig } = params[0];
  if (client)
    return construct(client, drizzlePgCDrizzlePgConfig);
  return construct(typeof connection === "string" ? new esm_default.Pool({ connectionString: connection }) : new esm_default.Pool(connection), drizzlePgCDrizzlePgConfig);
}
(function(_drizzle) {
  function mock(config) {
    return construct({}, config);
  }
  _drizzle.mock = mock;
})(drizzle || (drizzle = {}));

// src/db/index.ts
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle({ client: pool });
// node_modules/drizzle-orm/pg-core/columns/enum.js
var PgEnumObjectColumnBuilder2 = class extends PgColumnBuilder {
  static [entityKind] = "PgEnumObjectColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string enum", "PgEnumObjectColumn");
    this.config.enum = enumInstance;
  }
  build(table) {
    return new PgEnumObjectColumn2(table, this.config);
  }
};
var PgEnumObjectColumn2 = class extends PgColumn {
  static [entityKind] = "PgEnumObjectColumn";
  codec = "enum";
  enum;
  enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
    this.enumValues = config.enum.enumValues;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
var PgEnumColumnBuilder2 = class extends PgColumnBuilder {
  static [entityKind] = "PgEnumColumnBuilder";
  constructor(name, enumInstance) {
    super(name, "string enum", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  build(table) {
    return new PgEnumColumn2(table, this.config);
  }
};
var PgEnumColumn2 = class extends PgColumn {
  static [entityKind] = "PgEnumColumn";
  codec = "enum";
  enum;
  enumValues;
  constructor(table, config) {
    super(table, config);
    this.enum = config.enum;
    this.enumValues = config.enum.enumValues;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};
function pgEnum2(enumName, input) {
  return Array.isArray(input) ? pgEnumWithSchema2(enumName, [...input], undefined) : pgEnumObjectWithSchema2(enumName, input, undefined);
}
function pgEnumWithSchema2(enumName, values, schema) {
  const enumInstance = Object.assign((name) => new PgEnumColumnBuilder2(name ?? "", enumInstance), {
    enumName,
    enumValues: values,
    schema,
    [isPgEnumSym]: true
  });
  return enumInstance;
}
function pgEnumObjectWithSchema2(enumName, values, schema) {
  const enumInstance = Object.assign((name) => new PgEnumObjectColumnBuilder2(name ?? "", enumInstance), {
    enumName,
    enumValues: Object.values(values),
    schema,
    [isPgEnumSym]: true
  });
  return enumInstance;
}
// src/db/schema.ts
var roleEnum = pgEnum2("role", ["seller", "buyer", "admin", "stakeholder"]);
var user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum().array().default(["buyer"]),
  isActive: boolean("is_active").default(true).notNull(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date).notNull()
});
var session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
}, (table) => [index("session_userId_idx").on(table.userId)]);
var account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date).notNull()
}, (table) => [index("account_userId_idx").on(table.userId)]);
var verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date).notNull()
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);
var twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  verified: boolean("verified").default(true).notNull(),
  failedVerificationCount: integer("failed_verification_count").default(0).notNull(),
  lockedUntil: timestamp("locked_until")
}, (table) => [index("two_factor_user_id_idx").on(table.userId)]);
var seller_type_enum = pgEnum2("seller_type", [
  "supplier",
  "supplier_vendor",
  "retail_vendor"
]);
var sellers_profile = pgTable("sellers_profile", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  shopName: text("shop_name").notNull(),
  detailAddress: text("detail_address").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  phoneNumber: text("phone_number"),
  sellerType: seller_type_enum("seller_type").default("supplier").notNull(),
  pickupInstructions: text("pickup_instructions"),
  isCurrent: boolean("is_current").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date).notNull()
}, (table) => [uniqueIndex("sellers_profile_current_user_unique").on(table.userId).where(sql`${table.isCurrent} = true`)]);
var product_type_enum = pgEnum2("product_type", [
  "Leafy Greens",
  "Root and Tuber Vegetables",
  "Bulb and Stem Vegetables",
  "Flower Vegetables",
  "Fruit Vegetables",
  "Seeds and Legumes"
]);
var product_condition_enum = pgEnum2("product_condition", [
  "good",
  "fair",
  "needs_inspection"
]);
var scaling_type_enum = pgEnum2("scaling_type", [
  "sack",
  "kilo",
  "pile"
]);
var sellers_product = pgTable("sellers_product", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  productName: text("product_name").notNull(),
  imagUrl: text("image_url"),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  priceReductionPercent: decimal("price_reduction_percent", { precision: 5, scale: 2 }).default("0").notNull(),
  minimumPrice: decimal("minimum_price", { precision: 10, scale: 2 }),
  priceScheduleStartedAt: timestamp("price_schedule_started_at", { withTimezone: true }),
  priceReductionPeriodsApplied: integer("price_reduction_periods_applied").default(0).notNull(),
  productQty: decimal("product_qty", {
    precision: 10,
    scale: 2
  }),
  originalQty: decimal("original_qty", { precision: 10, scale: 2 }),
  lowStockThreshold: decimal("low_stock_threshold", { precision: 10, scale: 2 }),
  condition: product_condition_enum().default("needs_inspection").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  isMarketable: boolean("is_marketable").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  productType: product_type_enum().notNull(),
  scalingType: scaling_type_enum().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date).notNull()
}, (table) => [index("sellers_product_marketplace_visibility_idx").on(table.isActive, table.isMarketable, table.publishedAt)]);
var buyer_saved_products = pgTable("buyer_saved_products", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex("buyer_saved_products_buyer_product_unique").on(table.buyerId, table.productId),
  index("buyer_saved_products_buyer_created_idx").on(table.buyerId, table.createdAt)
]);
var seller_follows = pgTable("seller_follows", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex("seller_follows_buyer_seller_unique").on(table.buyerId, table.sellerId),
  index("seller_follows_seller_created_idx").on(table.sellerId, table.createdAt)
]);
var seller_listing_events = pgTable("seller_listing_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  shopName: text("shop_name").notNull(),
  productName: text("product_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true })
}, (table) => [
  uniqueIndex("seller_listing_events_product_unique").on(table.productId),
  index("seller_listing_events_pending_idx").on(table.processedAt, table.createdAt)
]);
var buyer_listing_notices = pgTable("buyer_listing_notices", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").notNull().references(() => seller_listing_events.id, { onDelete: "cascade" }),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex("buyer_listing_notices_buyer_event_unique").on(table.buyerId, table.eventId),
  index("buyer_listing_notices_buyer_created_idx").on(table.buyerId, table.createdAt)
]);
var listing_cycles = pgTable("listing_cycles", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  vegetableKey: text("vegetable_key").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  originalQty: decimal("original_qty", { precision: 10, scale: 2 }).notNull()
}, (table) => [
  index("listing_cycles_product_started_idx").on(table.productId, table.startedAt),
  index("listing_cycles_vegetable_started_idx").on(table.vegetableKey, table.startedAt)
]);
var seller_promotion_stage = pgEnum2("seller_promotion_stage", [
  "initial",
  "followup"
]);
var seller_promotion_status = pgEnum2("seller_promotion_status", [
  "waiting",
  "queued",
  "sent",
  "ready",
  "skipped",
  "failed"
]);
var seller_promotion_jobs = pgTable("seller_promotion_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingCycleId: uuid("listing_cycle_id").notNull().references(() => listing_cycles.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  stage: seller_promotion_stage().notNull(),
  status: seller_promotion_status().default("waiting").notNull(),
  nextCheckAt: timestamp("next_check_at", { withTimezone: true }).defaultNow().notNull(),
  retryCount: integer("retry_count").default(0).notNull(),
  leaseUntil: timestamp("lease_until", { withTimezone: true }),
  headline: text("headline"),
  caption: text("caption"),
  readyAt: timestamp("ready_at", { withTimezone: true }),
  readAt: timestamp("read_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date).notNull()
}, (table) => [
  uniqueIndex("seller_promotion_jobs_cycle_stage_unique").on(table.listingCycleId, table.stage),
  index("seller_promotion_jobs_due_idx").on(table.status, table.nextCheckAt),
  index("seller_promotion_jobs_seller_created_idx").on(table.sellerId, table.createdAt),
  index("seller_promotion_jobs_seller_read_created_idx").on(table.sellerId, table.readAt, table.createdAt)
]);
var product_stock_adjustments = pgTable("product_stock_adjustments", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "restrict" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "restrict" }),
  delta: decimal("delta", { precision: 11, scale: 2 }).notNull(),
  beforeQty: decimal("before_qty", { precision: 10, scale: 2 }).notNull(),
  afterQty: decimal("after_qty", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [index("product_stock_adjustments_product_created_idx").on(table.productId, table.createdAt)]);
var order_status = pgEnum2("order_status", [
  "pending",
  "completed",
  "cancelled",
  "expired"
]);
var checkouts = pgTable("checkouts", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  buyersId: text("buyers_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  idempotencyKey: text("idempotency_key").notNull(),
  requestFingerprint: text("request_fingerprint").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [
  uniqueIndex("checkouts_buyer_key_unique").on(table.buyersId, table.idempotencyKey)
]);
var orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  checkoutId: uuid("checkout_id").references(() => checkouts.id, {
    onDelete: "restrict"
  }),
  buyersId: text("buyers_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellersId: text("sellers_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  status: order_status().notNull().default("pending"),
  cancelledBy: text("cancelled_by"),
  cancellationReason: text("cancellation_reason"),
  totalAmount: decimal("total_amount").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date).notNull()
});
var seller_scan_grace = pgTable("seller_scan_grace", {
  orderId: uuid("order_id").primaryKey().references(() => orders.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  graceUntil: timestamp("grace_until", { withTimezone: true }).notNull()
});
var order_inquiries = pgTable("order_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  reply: text("reply"),
  repliedAt: timestamp("replied_at", { withTimezone: true }),
  deadlineStage: smallint("deadline_stage").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [uniqueIndex("order_inquiries_one_open_per_order").on(table.orderId).where(sql`${table.repliedAt} is null`)]);
var order_reviews = pgTable("order_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().unique().references(() => orders.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  review: text("review"),
  sellerResponse: text("seller_response"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
var order_reports = pgTable("order_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  reporterId: text("reporter_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [uniqueIndex("order_reports_order_reporter_unique").on(table.orderId, table.reporterId)]);
var order_report_evidence = pgTable("order_report_evidence", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id").notNull().references(() => order_reports.id, { onDelete: "cascade" }),
  objectKey: text("object_key").notNull().unique(),
  contentType: text("content_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [index("order_report_evidence_report_created_idx").on(table.reportId, table.createdAt)]);
var product_inquiries = pgTable("product_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  reply: text("reply"),
  repliedAt: timestamp("replied_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex("product_inquiries_one_open_per_buyer_product_idx").on(table.productId, table.buyerId).where(sql`${table.repliedAt} is null`),
  index("product_inquiries_seller_created_idx").on(table.sellerId, table.createdAt),
  index("product_inquiries_buyer_product_idx").on(table.buyerId, table.productId, table.createdAt)
]);
var trust_events = pgTable("trust_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventKey: text("event_key").notNull().unique(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  classification: text("classification").notNull(),
  sourceId: uuid("source_id"),
  policyVersion: text("policy_version").notNull().default("v1-warning-only"),
  invalidatedAt: timestamp("invalidated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index("trust_events_monitor_subject_idx").on(table.subjectId, table.classification, table.invalidatedAt),
  index("trust_events_monitor_global_idx").on(table.classification, table.invalidatedAt)
]);
var trust_notices = pgTable("trust_notices", {
  id: uuid("id").defaultRandom().primaryKey(),
  noticeKey: text("notice_key").notNull().unique(),
  recipientId: text("recipient_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
var trust_corrections = pgTable("trust_corrections", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull().unique().references(() => trust_events.id, { onDelete: "cascade" }),
  requesterId: text("requester_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  outcome: text("outcome").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
var ordered_items = pgTable("ordered_items", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  ordersId: uuid("orders_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "restrict" }),
  productName: text("product_name"),
  scalingType: scaling_type_enum("scaling_type"),
  quantity: decimal("quantity", {
    precision: 10,
    scale: 2
  }),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", {
    precision: 20,
    scale: 2
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date).notNull()
});
var product_reviews = pgTable("product_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  orderedItemId: uuid("ordered_item_id").notNull().unique().references(() => ordered_items.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "restrict" }),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index("product_reviews_product_created_idx").on(table.productId, table.createdAt)
]);

// src/utils/order-stock/index.ts
async function restoreOrderStock(tx, orderId) {
  const items = await tx.select({ productId: ordered_items.productId, quantity: ordered_items.quantity }).from(ordered_items).where(eq(ordered_items.ordersId, orderId));
  if (!items.length || items.some((item) => item.quantity === null)) {
    throw new Error("Order items are missing a quantity");
  }
  for (const item of items) {
    const [updated] = await tx.update(sellers_product).set({ productQty: sql`${sellers_product.productQty} + ${item.quantity}` }).where(eq(sellers_product.id, item.productId)).returning({ id: sellers_product.id });
    if (!updated)
      throw new Error("Order product is missing");
  }
}

// src/modules/buyer/services/buyer.order.expire.ts
async function expirePendingOrders(limit = 100) {
  const due = await db.select({ id: orders.id }).from(orders).where(and(eq(orders.status, "pending"), lte(orders.expiresAt, new Date))).orderBy(orders.expiresAt).limit(limit);
  let expiredCount = 0;
  for (const row of due) {
    const expired = await db.transaction(async (tx) => {
      const [updated] = await tx.update(orders).set({ status: "expired", expiredAt: new Date, updatedAt: new Date }).where(and(eq(orders.id, row.id), eq(orders.status, "pending"), lte(orders.expiresAt, new Date))).returning({ id: orders.id });
      if (!updated)
        return false;
      await restoreOrderStock(tx, updated.id);
      return true;
    });
    if (expired)
      expiredCount++;
  }
  return expiredCount;
}

// src/utils/trust/index.ts
function recordTrustEvent(tx, input) {
  return tx.insert(trust_events).values(input).onConflictDoNothing({ target: trust_events.eventKey }).returning();
}
function queueTrustNotice(tx, input) {
  return tx.insert(trust_notices).values(input).onConflictDoNothing({ target: trust_notices.noticeKey }).returning();
}
async function recordInquiryDeadlines(tx, inquiry, now) {
  const hours = (now.getTime() - inquiry.createdAt.getTime()) / 3600000;
  if (hours >= 12)
    await queueTrustNotice(tx, {
      noticeKey: `inquiry-reminder:${inquiry.id}`,
      recipientId: inquiry.sellerId,
      orderId: inquiry.orderId,
      kind: "inquiry_12h_reminder"
    });
  if (hours >= 24) {
    await queueTrustNotice(tx, {
      noticeKey: `inquiry-warning:${inquiry.id}`,
      recipientId: inquiry.sellerId,
      orderId: inquiry.orderId,
      kind: "inquiry_24h_warning"
    });
    await queueTrustNotice(tx, {
      noticeKey: `inquiry-buyer:${inquiry.id}`,
      recipientId: inquiry.buyerId,
      orderId: inquiry.orderId,
      kind: "inquiry_24h_buyer_notice"
    });
  }
  if (hours >= 48)
    await recordTrustEvent(tx, {
      eventKey: `inquiry-unanswered:${inquiry.id}`,
      orderId: inquiry.orderId,
      subjectId: inquiry.sellerId,
      kind: "inquiry_non_response",
      classification: "verified",
      sourceId: inquiry.id
    });
}

// src/utils/trust/process-inquiries.ts
async function processInquiryDeadlines(limit = 100) {
  const now = new Date;
  const dueCondition = or(and(eq(order_inquiries.deadlineStage, 0), lte(order_inquiries.createdAt, new Date(now.getTime() - 12 * 3600000))), and(eq(order_inquiries.deadlineStage, 1), lte(order_inquiries.createdAt, new Date(now.getTime() - 24 * 3600000))), and(eq(order_inquiries.deadlineStage, 2), lte(order_inquiries.createdAt, new Date(now.getTime() - 48 * 3600000))));
  const due = await db.select().from(order_inquiries).where(and(isNull(order_inquiries.repliedAt), dueCondition)).limit(limit);
  for (const row of due) {
    await db.transaction(async (tx) => {
      const [current] = await tx.select().from(order_inquiries).where(and(eq(order_inquiries.id, row.id), isNull(order_inquiries.repliedAt), dueCondition)).for("update").limit(1);
      if (current) {
        await recordInquiryDeadlines(tx, current, now);
        const age = (now.getTime() - current.createdAt.getTime()) / 3600000;
        await tx.update(order_inquiries).set({ deadlineStage: age >= 48 ? 3 : age >= 24 ? 2 : 1 }).where(eq(order_inquiries.id, current.id));
      }
    });
  }
  return due.length;
}

// src/utils/email/index.ts
var import_dotenv = __toESM(require_main());
import { createHash } from "crypto";
async function sendEmail(to, subject, text, key) {
  import_dotenv.default.config({ override: true });
  const provider = resolveEmailProvider();
  const idempotencyKey = createHash("sha256").update(key).digest("hex");
  const allowDevEmailLog = process.env.ALLOW_DEV_EMAIL_LOG === "true";
  if (provider === "mailtrap") {
    const mailtrapToken = process.env.MAILTRAP_API_TOKEN?.trim();
    const mailtrapInboxId = process.env.MAILTRAP_INBOX_ID?.trim();
    if (!mailtrapToken || !mailtrapInboxId) {
      if (allowDevEmailLog) {
        console.log(`[Dev Sandbox] Simulated Mailtrap delivery to ${to}`);
        return;
      }
      throw new Error("Mailtrap email provider requires MAILTRAP_API_TOKEN and MAILTRAP_INBOX_ID");
    }
    const response = await fetch(`https://sandbox.api.mailtrap.io/api/send/${mailtrapInboxId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mailtrapToken}`,
        "Api-Token": mailtrapToken,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify({
        to: [{ email: to }],
        from: { email: "noreply@agrivive.com", name: "Agrivive" },
        subject,
        text
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Mailtrap Error] Delivery to ${to} failed (${response.status}):`, errorText);
      throw new Error(`Mailtrap delivery failed (${response.status}): ${errorText}`);
    }
    console.log(`[Mailtrap Success] Email captured in Mailtrap inbox for ${to}`);
    return;
  }
  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM_EMAIL?.trim();
    if (!apiKey || !from) {
      if (allowDevEmailLog) {
        console.log(`[Dev Sandbox] Simulated Resend delivery to ${to}`);
        return;
      }
      throw new Error("Resend email provider requires RESEND_API_KEY and RESEND_FROM_EMAIL");
    }
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey
      },
      body: JSON.stringify({ from, to: [to], subject, text })
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Resend Error] Delivery to ${to} failed (${response.status}):`, errorBody);
      throw new Error(`Resend delivery failed (${response.status}): ${errorBody}`);
    }
    console.log(`[Resend Success] Verification email sent to ${to}`);
    return;
  }
  if (allowDevEmailLog) {
    console.log(`[Dev Sandbox] Simulated email delivery to ${to}`);
    return;
  }
  throw new Error("Email provider is not configured");
}
function resolveEmailProvider() {
  const configured = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (configured && configured !== "mailtrap" && configured !== "resend") {
    throw new Error("EMAIL_PROVIDER must be resend or mailtrap");
  }
  if (configured === "mailtrap" || configured === "resend")
    return configured;
  return "mailtrap";
}

// src/utils/trust/send-notices.ts
var messages = {
  seller_cancellation_warning: { subject: "Agrivive order cancellation warning", text: "You cancelled a pending buyer order. This event was recorded in your trust history." },
  seller_cancellation_buyer: { subject: "Agrivive order cancelled", text: "The seller cancelled your order. Reserved stock was restored." },
  inquiry_12h_reminder: { subject: "Agrivive inquiry reminder", text: "A buyer inquiry has been waiting for your reply for 12 hours." },
  inquiry_24h_warning: { subject: "Agrivive inquiry warning", text: "A buyer inquiry has been waiting for your reply for 24 hours." },
  inquiry_24h_buyer_notice: { subject: "Agrivive inquiry update", text: "The seller has not replied to your inquiry after 24 hours." },
  trust_event_corrected: { subject: "Agrivive trust record corrected", text: "A trust event was invalidated after its source data was rechecked." }
};
async function sendPendingTrustNotices(limit = 25) {
  let sent = 0;
  for (let i = 0;i < limit; i++) {
    const available = and(isNull(trust_notices.sentAt), lt(trust_notices.attempts, 5), or(isNull(trust_notices.lockedUntil), lte(trust_notices.lockedUntil, new Date)));
    const [candidate] = await db.select({ id: trust_notices.id }).from(trust_notices).where(available).orderBy(asc(trust_notices.createdAt)).limit(1);
    if (!candidate)
      break;
    const [notice] = await db.update(trust_notices).set({
      attempts: sql`${trust_notices.attempts} + 1`,
      lockedUntil: new Date(Date.now() + 5 * 60000)
    }).where(and(eq(trust_notices.id, candidate.id), available)).returning();
    if (!notice)
      continue;
    const [recipient] = await db.select({ email: user.email }).from(user).where(eq(user.id, notice.recipientId)).limit(1);
    const message = messages[notice.kind];
    if (!recipient || !message)
      continue;
    try {
      await sendEmail(recipient.email, message.subject, `${message.text}
Order: ${notice.orderId}`, `trust:${notice.noticeKey}`);
      await db.update(trust_notices).set({ sentAt: new Date, lockedUntil: null }).where(eq(trust_notices.id, notice.id));
      sent++;
    } catch (error) {
      console.error("Trust notice delivery failed", { noticeId: notice.id, error });
      await db.update(trust_notices).set({ lockedUntil: new Date(Date.now() + 5 * 60000) }).where(eq(trust_notices.id, notice.id));
    }
  }
  return sent;
}

// src/jobs/send-seller-listing-notices.ts
async function sendSellerListingNotices(limit = 25) {
  let processedEvents = 0;
  let noticesCreated = 0;
  for (let i = 0;i < limit; i++) {
    const result = await db.transaction(async (tx) => {
      const [event] = await tx.select().from(seller_listing_events).where(isNull(seller_listing_events.processedAt)).orderBy(asc(seller_listing_events.createdAt)).limit(1).for("update", { skipLocked: true });
      if (!event)
        return null;
      const inserted = await tx.execute(sql`
        insert into ${buyer_listing_notices} (buyer_id, event_id)
        select ${seller_follows.buyerId}, ${event.id}::uuid
        from ${seller_follows}
        inner join ${user} on ${user.id} = ${seller_follows.buyerId}
        where ${seller_follows.sellerId} = ${event.sellerId}
          and ${seller_follows.createdAt} <= ${event.createdAt}
          and ${user.isActive} = true
          and 'buyer'::"role" = any(${user.role})
        on conflict (buyer_id, event_id) do nothing
        returning id
      `);
      await tx.update(seller_listing_events).set({ processedAt: new Date }).where(sql`${seller_listing_events.id} = ${event.id}`);
      return inserted.rowCount ?? 0;
    });
    if (result === null)
      break;
    processedEvents++;
    noticesCreated += result;
  }
  return { processedEvents, noticesCreated };
}

// src/utils/vegetable-identity/index.ts
function normalizeVegetableName(name) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

// src/utils/visibility-score/index.ts
var clamp = (value) => Math.min(1, Math.max(0, value));
var hourMs = 60 * 60 * 1000;
function calculateVisibilityScore(input) {
  if (!input.publishedAt || input.publishedAt > input.evaluatedAt || !Number.isFinite(input.quantity) || !Number.isFinite(input.originalQuantity) || input.originalQuantity <= 0)
    return null;
  const postingAge = clamp((input.evaluatedAt.getTime() - input.publishedAt.getTime()) / (12 * hourMs));
  const remainingQuantity = clamp(input.quantity / input.originalQuantity);
  const recurrence = clamp(input.priorCycles / 3);
  const score = 0.4 * postingAge + 0.4 * remainingQuantity + 0.2 * recurrence;
  return {
    score,
    tier: score >= 0.7 ? "priority" : score >= 0.4 ? "standard" : "basic",
    inputs: { postingAge, remainingQuantity, recurrence, priorCycles: input.priorCycles }
  };
}

// src/utils/promotion-eligibility/index.ts
var hour = 60 * 60 * 1000;
function marketplaceUrl(productId) {
  const base = (process.env.WEB_APP_URL ?? process.env.WEB_TRUSTED_ORIGINS?.split(",")[0] ?? "").trim().replace(/\/$/, "");
  const path = `/marketplace/${productId}`;
  try {
    return base ? new URL(path, base).toString() : path;
  } catch {
    return path;
  }
}
async function getPriorityPromotionEligibility(listingCycleId) {
  const [row] = await db.select({
    cycleId: listing_cycles.id,
    cycleStartedAt: listing_cycles.startedAt,
    cycleVegetableKey: listing_cycles.vegetableKey,
    sellerId: sellers_product.userId,
    productId: sellers_product.id,
    productName: sellers_product.productName,
    productType: sellers_product.productType,
    unit: sellers_product.scalingType,
    publishedAt: sellers_product.publishedAt,
    quantity: sellers_product.productQty,
    originalQuantity: sellers_product.originalQty,
    price: sellers_product.productPrice,
    isActive: sellers_product.isActive,
    isMarketable: sellers_product.isMarketable,
    sellerActive: user.isActive,
    sellerVerified: user.emailVerified,
    sellerRoles: user.role,
    sellerName: user.name,
    shopName: sellers_profile.shopName,
    detailAddress: sellers_profile.detailAddress,
    phoneNumber: sellers_profile.phoneNumber,
    latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude
  }).from(listing_cycles).innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId)).innerJoin(user, eq(user.id, sellers_product.userId)).innerJoin(sellers_profile, and(eq(sellers_profile.userId, user.id), eq(sellers_profile.isCurrent, true))).where(eq(listing_cycles.id, listingCycleId)).limit(1);
  if (!row)
    return null;
  const evaluatedAt = new Date;
  const currentCycle = await db.select({ id: listing_cycles.id }).from(listing_cycles).where(and(eq(listing_cycles.productId, row.productId), lte(listing_cycles.startedAt, evaluatedAt))).orderBy(desc(listing_cycles.startedAt)).limit(1);
  const isCurrentCycle = currentCycle[0]?.id === row.cycleId;
  const quantity = Number(row.quantity);
  const originalQuantity = Number(row.originalQuantity);
  const publicSeller = row.sellerActive && row.sellerVerified && row.sellerRoles?.includes("seller") && row.shopName.trim().length > 0 && row.detailAddress.trim().length > 0 && (row.phoneNumber?.trim().length ?? 0) >= 7 && row.latitude !== null && Number.isFinite(row.latitude) && row.latitude >= -90 && row.latitude <= 90 && row.longitude !== null && Number.isFinite(row.longitude) && row.longitude >= -180 && row.longitude <= 180;
  const marketable = row.isActive && row.isMarketable && Number(row.price) > 0 && quantity > 0;
  if (!isCurrentCycle || !publicSeller || !marketable || !row.publishedAt || !Number.isFinite(originalQuantity) || originalQuantity <= 0) {
    return {
      eligible: false,
      reason: !isCurrentCycle ? "Listing cycle is no longer current" : "Listing is not currently public and buyable",
      listingCycleId: row.cycleId,
      sellerId: row.sellerId,
      productId: row.productId,
      visibilityScore: null,
      policyVersion: "visibility-v4"
    };
  }
  const since = new Date(evaluatedAt.getTime() - 30 * 24 * hour);
  const cycles = await db.select({
    id: listing_cycles.id,
    productId: listing_cycles.productId,
    vegetableKey: listing_cycles.vegetableKey,
    startedAt: listing_cycles.startedAt
  }).from(listing_cycles).innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId)).where(and(eq(sellers_product.userId, row.sellerId), gte(listing_cycles.startedAt, since), lte(listing_cycles.startedAt, evaluatedAt)));
  const recentCurrent = cycles.filter((cycle) => cycle.productId === row.productId && cycle.startedAt <= evaluatedAt).sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
  const vegetableKey = recentCurrent && row.publishedAt && Math.abs(recentCurrent.startedAt.getTime() - row.publishedAt.getTime()) <= 60000 ? recentCurrent.vegetableKey : normalizeVegetableName(row.productName);
  const priorCycles = cycles.filter((cycle) => cycle.vegetableKey === vegetableKey && cycle.startedAt < row.publishedAt && cycle.id !== recentCurrent?.id).length;
  const visibility = calculateVisibilityScore({
    evaluatedAt,
    publishedAt: row.publishedAt,
    quantity,
    originalQuantity,
    priorCycles
  });
  if (!visibility || visibility.score < 0.7) {
    return {
      eligible: false,
      reason: "Visibility is below Priority Boost",
      listingCycleId: row.cycleId,
      sellerId: row.sellerId,
      productId: row.productId,
      visibilityScore: visibility ? Number(visibility.score.toFixed(4)) : null,
      visibilityTier: visibility?.tier ?? null,
      policyVersion: "visibility-v4"
    };
  }
  return {
    eligible: true,
    reason: null,
    listingCycleId: row.cycleId,
    sellerId: row.sellerId,
    productId: row.productId,
    visibilityScore: Number(visibility.score.toFixed(4)),
    visibilityTier: visibility.tier,
    policyVersion: "visibility-v4",
    productName: row.productName,
    productType: row.productType,
    unit: row.unit,
    price: row.price,
    quantity: row.quantity,
    shopName: row.shopName,
    sellerName: row.sellerName,
    listingUrl: marketplaceUrl(row.productId)
  };
}

// src/jobs/check-seller-promotion-eligibility.ts
var hourMs2 = 60 * 60 * 1000;
var batchSize = 100;
async function addJobsForNewCycles(now) {
  const unseen = await db.select({
    listingCycleId: listing_cycles.id,
    productId: sellers_product.id,
    sellerId: sellers_product.userId
  }).from(listing_cycles).innerJoin(sellers_product, eq(sellers_product.id, listing_cycles.productId)).leftJoin(seller_promotion_jobs, and(eq(seller_promotion_jobs.listingCycleId, listing_cycles.id), eq(seller_promotion_jobs.stage, "initial"))).where(isNull(seller_promotion_jobs.id)).limit(batchSize);
  for (const cycle of unseen) {
    await db.insert(seller_promotion_jobs).values({
      ...cycle,
      stage: "initial",
      status: "waiting",
      nextCheckAt: now
    }).onConflictDoNothing();
  }
  return unseen.length;
}
async function checkSellerPromotionEligibility() {
  const now = new Date;
  const discovered = await addJobsForNewCycles(now);
  const due = await db.select({
    id: seller_promotion_jobs.id,
    listingCycleId: seller_promotion_jobs.listingCycleId,
    stage: seller_promotion_jobs.stage
  }).from(seller_promotion_jobs).where(and(eq(seller_promotion_jobs.status, "waiting"), lte(seller_promotion_jobs.nextCheckAt, now), or(isNull(seller_promotion_jobs.leaseUntil), lte(seller_promotion_jobs.leaseUntil, now)))).limit(batchSize);
  let queued = 0;
  let rescheduled = 0;
  let skipped = 0;
  let failed = 0;
  for (const job of due) {
    try {
      const claimed = await db.update(seller_promotion_jobs).set({
        leaseUntil: new Date(now.getTime() + 15000)
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting"), lte(seller_promotion_jobs.nextCheckAt, now), or(isNull(seller_promotion_jobs.leaseUntil), lte(seller_promotion_jobs.leaseUntil, now)))).returning({ id: seller_promotion_jobs.id });
      if (!claimed.length)
        continue;
      const eligibility = await getPriorityPromotionEligibility(job.listingCycleId);
      if (!eligibility) {
        await db.update(seller_promotion_jobs).set({
          status: "skipped",
          leaseUntil: null,
          lastError: "Listing cycle is no longer available",
          updatedAt: now
        }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")));
        skipped++;
        continue;
      }
      if (!eligibility.eligible && eligibility.visibilityScore !== null && job.stage === "initial") {
        await db.update(seller_promotion_jobs).set({
          nextCheckAt: new Date(now.getTime() + hourMs2),
          leaseUntil: null,
          lastError: null,
          updatedAt: now
        }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")));
        rescheduled++;
        continue;
      }
      if (!eligibility.eligible) {
        await db.update(seller_promotion_jobs).set({
          status: "skipped",
          leaseUntil: null,
          lastError: eligibility.reason ?? "Listing is no longer eligible",
          updatedAt: now
        }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")));
        skipped++;
        continue;
      }
      const updated = await db.update(seller_promotion_jobs).set({
        status: "queued",
        nextCheckAt: now,
        leaseUntil: null,
        lastError: null,
        updatedAt: now
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting"))).returning({ id: seller_promotion_jobs.id });
      if (updated.length)
        queued++;
    } catch (error) {
      console.error("Promotion eligibility check failed", { jobId: job.id, stage: job.stage, error });
      await db.update(seller_promotion_jobs).set({
        nextCheckAt: new Date(now.getTime() + hourMs2),
        leaseUntil: null,
        lastError: "Eligibility check could not be completed",
        updatedAt: now
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "waiting")));
      failed++;
    }
  }
  return { discovered, checked: due.length, queued, rescheduled, skipped, failed };
}

// src/jobs/deliver-seller-promotion-webhooks.ts
var maxAttempts = 5;
var batchSize2 = 50;
var draftResponseTimeoutMs = 2 * 60000;
function retryDelay(attempt) {
  return Math.min(30000 * 2 ** Math.max(0, attempt - 1), 30 * 60000);
}
async function deliverSellerPromotionWebhooks() {
  const webhookUrl = process.env.N8N_PROMOTION_WEBHOOK_URL?.trim();
  const serviceToken = process.env.N8N_PROMOTION_SERVICE_TOKEN?.trim();
  if (!webhookUrl || !serviceToken)
    return { configured: false, queued: 0, sent: 0, failed: 0 };
  let target;
  try {
    target = new URL(webhookUrl);
    if (target.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(target.hostname)) {
      return { configured: false, queued: 0, sent: 0, failed: 0 };
    }
  } catch {
    return { configured: false, queued: 0, sent: 0, failed: 0 };
  }
  const now = new Date;
  const due = await db.select({
    id: seller_promotion_jobs.id,
    stage: seller_promotion_jobs.stage,
    status: seller_promotion_jobs.status,
    retryCount: seller_promotion_jobs.retryCount
  }).from(seller_promotion_jobs).where(and(or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent")), lte(seller_promotion_jobs.nextCheckAt, now), or(isNull(seller_promotion_jobs.leaseUntil), lte(seller_promotion_jobs.leaseUntil, now)))).limit(batchSize2);
  let sent = 0;
  let failed = 0;
  for (const job of due) {
    const claimed = await db.update(seller_promotion_jobs).set({
      leaseUntil: new Date(now.getTime() + 15000)
    }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, job.status), lte(seller_promotion_jobs.nextCheckAt, now), or(isNull(seller_promotion_jobs.leaseUntil), lte(seller_promotion_jobs.leaseUntil, now)))).returning({ id: seller_promotion_jobs.id });
    if (!claimed.length)
      continue;
    if (job.status === "sent" && job.retryCount >= maxAttempts) {
      await db.update(seller_promotion_jobs).set({
        status: "failed",
        leaseUntil: null,
        lastError: "No draft response was received after the retry limit",
        updatedAt: now
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "sent")));
      failed++;
      continue;
    }
    if (job.status === "sent") {
      await db.update(seller_promotion_jobs).set({
        status: "queued",
        nextCheckAt: now,
        updatedAt: now
      }).where(and(eq(seller_promotion_jobs.id, job.id), eq(seller_promotion_jobs.status, "sent")));
    }
    try {
      const response = await fetch(target, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceToken}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ jobId: job.id, stage: job.stage }),
        signal: AbortSignal.timeout(1e4)
      });
      const attempt = job.retryCount + 1;
      if (!response.ok) {
        const exhausted = attempt >= maxAttempts;
        await db.update(seller_promotion_jobs).set({
          status: exhausted ? "failed" : "queued",
          retryCount: attempt,
          leaseUntil: null,
          nextCheckAt: new Date(now.getTime() + retryDelay(attempt)),
          lastError: `n8n webhook returned HTTP ${response.status}`,
          updatedAt: now
        }).where(and(eq(seller_promotion_jobs.id, job.id), or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent"))));
        if (exhausted)
          failed++;
        continue;
      }
      await db.update(seller_promotion_jobs).set({
        status: "sent",
        retryCount: attempt,
        leaseUntil: null,
        nextCheckAt: new Date(now.getTime() + draftResponseTimeoutMs),
        lastError: null,
        updatedAt: now
      }).where(and(eq(seller_promotion_jobs.id, job.id), or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent"))));
      sent++;
    } catch (error) {
      const attempt = job.retryCount + 1;
      const exhausted = attempt >= maxAttempts;
      console.error("Promotion webhook delivery failed", { jobId: job.id, stage: job.stage, error });
      await db.update(seller_promotion_jobs).set({
        status: exhausted ? "failed" : "queued",
        retryCount: attempt,
        leaseUntil: null,
        nextCheckAt: new Date(now.getTime() + retryDelay(attempt)),
        lastError: "n8n webhook delivery failed",
        updatedAt: now
      }).where(and(eq(seller_promotion_jobs.id, job.id), or(eq(seller_promotion_jobs.status, "queued"), eq(seller_promotion_jobs.status, "sent"))));
      if (exhausted)
        failed++;
    }
  }
  return { configured: true, queued: due.length, sent, failed };
}

// src/jobs/run-scheduled.ts
async function runScheduledJobs() {
  const expiredOrders = await expirePendingOrders();
  const inquiriesProcessed = await processInquiryDeadlines();
  const noticesSent = await sendPendingTrustNotices();
  const sellerListingNotices = await sendSellerListingNotices();
  const sellerPromotionChecks = await checkSellerPromotionEligibility();
  const sellerPromotionWebhooks = await deliverSellerPromotionWebhooks();
  return { expiredOrders, inquiriesProcessed, noticesSent, sellerListingNotices, sellerPromotionChecks, sellerPromotionWebhooks };
}

// src/worker.ts
var running = false;
var stopping = false;
async function tick() {
  if (running)
    return;
  running = true;
  try {
    const result = await runScheduledJobs();
    console.log("Scheduled jobs completed", result);
  } catch (error) {
    console.error("Scheduled jobs failed", error);
  } finally {
    running = false;
  }
}
tick();
var timer = setInterval(() => void tick(), 60000);
async function stop() {
  if (stopping)
    return;
  stopping = true;
  clearInterval(timer);
  while (running)
    await new Promise((resolve) => setTimeout(resolve, 100));
  process.exit(0);
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
