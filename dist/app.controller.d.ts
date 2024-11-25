import { AppService } from './app.service';
interface Movie {
    id: number;
    title: string;
}
export declare class AppController {
    private readonly appService;
    private movies;
    private idCounter;
    constructor(appService: AppService);
    getMovies(title?: string): Movie[];
    getMovie(id: string): Movie;
    postMovie(title: string): Movie;
    patchMovie(id: string, title: string): Movie;
    deleteMove(id: string): string;
}
export {};
