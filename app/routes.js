import homeController from '../src/controllers/HomeController.js';
import { get as authControllerGet, post as authControllerPost, authControllerDisconnect } from '../src/controllers/AuthController.js';
import { get as adminControllerGet, post as adminControllerPost, searchMovies, saveInBddMovie } from '../src/controllers/AdminController.js';
import { userExists, controlJWT } from '../src/services/jwtService.js';
import * as a2f from '../src/services/a2fService.js';



export default (app) => {
    app.use('/', userExists);

    // Gérer le JWT pour toutes les urls commençant par /admin
    app.use('/admin', controlJWT);

    // A2F
    app.get('/profil', a2f.enable);
    app.get('/2fa-valid', a2f.form);
    app.post('/2fa-valid', a2f.valid);

    app.get('/search', searchMovies);

    app.get('/', homeController);

    app.get('/connexion', authControllerGet);
    app.post('/connexion', authControllerPost);
    app.get('/deconnexion', authControllerDisconnect);
    
    app.get('/admin', adminControllerGet);
    app.get('/admin/movie/:id', adminControllerPost); // Assurez-vous que cette fonction existe
    app.post('/admin/movie/:id', saveInBddMovie); // Utilisez saveInBddMovie pour la route POST
    
    // app.post('login', authControllerPost);
};

