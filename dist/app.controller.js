"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
        this.movies = [
            {
                id: 1,
                title: '해리포터',
            },
            {
                id: 2,
                title: '단단단',
            }
        ];
        this.idCounter = 3;
    }
    getMovies(title) {
        if (!title) {
            return this.movies;
        }
        return this.movies.filter(m => m.title.startsWith(title));
    }
    getMovie(id) {
        const movie = this.movies.find((m) => m.id === +id);
        if (!movie) {
            throw new common_1.NotFoundException('존재하지 않는 id의 영화입니다.');
        }
        return movie;
    }
    postMovie(title) {
        const movie = {
            id: this.idCounter++,
            title: title,
        };
        this.movies.push(movie);
        return movie;
    }
    patchMovie(id, title) {
        const movie = this.movies.find((m) => m.id === +id);
        if (!movie) {
            throw new common_1.NotFoundException('존재하지 않는 id의 영화입니다.');
        }
        Object.assign(movie, { title });
        return movie;
    }
    deleteMove(id) {
        const movieIndex = this.movies.findIndex((m) => m.id === +id);
        if (movieIndex === -1) {
            throw new common_1.NotFoundException('존재하지 않는 id의 영화입니다.');
        }
        this.movies.splice(movieIndex, 1);
        return id;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMovies", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMovie", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "postMovie", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "patchMovie", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteMove", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('movie'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map