"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var util_1 = require("util");
var fs = require("fs/promises");
var path = require("path");
// Muunna exec-funktio Promise-pohjaiseksi
var execPromise = (0, util_1.promisify)(child_process_1.exec);
// Kovakoodattu GitHub-osoite
var GITHUB_URL = 'https://github.com/Summer-project-25-AI-Feedback-system/AI-Feedback-System.git';
/**
 * Poistaa GitHub-repositorion nimen URL:sta
 * @param url GitHub-repositorion URL
 * @returns Repositorion nimi
 */
function getRepoNameFromUrl(url) {
    // Poista mahdollinen .git-pääte
    var cleanUrl = url.replace(/\.git$/, '');
    // Hae viimeinen osa URL:sta (repositorion nimi)
    var repoName = cleanUrl.split('/').pop() || 'unknown-repo';
    return repoName;
}
var RepomixFetcher = /** @class */ (function () {
    function RepomixFetcher(outputDir) {
        if (outputDir === void 0) { outputDir = 'output'; }
        this.outputDir = path.resolve(outputDir);
        this.tempDir = path.join(process.cwd(), "repomix-temp-".concat(Date.now()));
    }
    RepomixFetcher.prototype.ensureDirectories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, fs.access(this.outputDir, fs.constants.W_OK).catch(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, fs.mkdir(this.outputDir, { recursive: true })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs.rm(this.tempDir, { recursive: true, force: true }).catch(function () { })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs.mkdir(this.tempDir, { recursive: true })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, fs.access(this.tempDir, fs.constants.W_OK)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        throw new Error("Failed to set up directories: ".concat(error_1 instanceof Error ? error_1.message : error_1));
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RepomixFetcher.prototype.fetchRepositoryAsXml = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var outputFileName, actualOutputFile, tempOutputFile, command, execOptions, _a, stdout, stderr, error_2, _b;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.ensureDirectories()];
                    case 1:
                        _e.sent();
                        outputFileName = (_c = options.outputFile) !== null && _c !== void 0 ? _c : `repomix-output-${Date.now()}.xml`;
                        actualOutputFile = path.join(this.outputDir, outputFileName).replace(/\\/g, '/');
                        tempOutputFile = path.join(this.tempDir, outputFileName).replace(/\\/g, '/');
                        command = "repomix --remote ".concat(options.remoteUrl, " --style ").concat((_d = options.style) !== null && _d !== void 0 ? _d : 'xml', " --output \"").concat(outputFileName, "\"");
                        if (options.ignore)
                            command += " --ignore \"".concat(options.ignore, "\"");
                        if (options.include)
                            command += " --include \"".concat(options.include, "\"");
                        if (options.verbose)
                            command += " --verbose";
                        execOptions = {
                            env: __assign(__assign({}, process.env), { PYTHONIOENCODING: 'utf-8', TMPDIR: this.tempDir, TEMP: this.tempDir, TMP: this.tempDir }),
                            cwd: this.tempDir,
                        };
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, 14, 16]);
                        return [4 /*yield*/, execPromise(command, execOptions)];
                    case 3:
                        _a = _e.sent(), stdout = _a.stdout, stderr = _a.stderr;
                        if (stderr)
                            console.warn("Repomix stderr: ".concat(stderr));
                        if (stdout)
                            console.log("Repomix stdout: ".concat(stdout));
                        return [4 /*yield*/, fs.access(tempOutputFile, fs.constants.R_OK)];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, fs.rename(tempOutputFile, actualOutputFile)];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, fs.readFile(actualOutputFile, 'utf-8')];
                    case 6: return [2 /*return*/, _e.sent()];
                    case 7:
                        error_2 = _e.sent();
                        _e.label = 8;
                    case 8:
                        _e.trys.push([8, 12, , 13]);
                        return [4 /*yield*/, fs.access(tempOutputFile, fs.constants.R_OK)];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, fs.rename(tempOutputFile, actualOutputFile)];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, fs.readFile(actualOutputFile, 'utf-8')];
                    case 11: return [2 /*return*/, _e.sent()];
                    case 12:
                        _b = _e.sent();
                        return [3 /*break*/, 13];
                    case 13: throw new Error("Failed to fetch repository with Repomix: ".concat(error_2.message));
                    case 14: return [4 /*yield*/, fs.rm(this.tempDir, { recursive: true, force: true }).catch(function () { })];
                    case 15:
                        _e.sent();
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    return RepomixFetcher;
}());
exports.default = RepomixFetcher;
