/* app/controllers/welcome.controller.ts */

// Import only what we need from express
import { Router, Request, Response } from 'express';

// Assign router to the express.Router() instance
const router: Router = Router();


router.get('/', (req: Request, res: Response) => {
    // Reply with a hello world when no name param is provided
    res.send('logins');
});
router.post('/j', (req: Request, res: Response) => {
    console.log(req.ip)
    res.json(req.body)

})


// Export the express.Router() instance to be used by server.ts
export const BdataController: Router = router;